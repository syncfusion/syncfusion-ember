"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
(function ($) {
    var ejMediaPlayer = (function (_super) {
        __extends(ejMediaPlayer, _super);
        function ejMediaPlayer(element, options) {
            _super.call(this);
            this.rootCSS = "e-mediaplayer";
            this.PluginName = "ejMediaPlayer";
            this._id = "null";
            this._playlist = [];
            this._mediaIndex = 0;
            this._mediaDiv = null;
            this._youtubeIns = null;
            this._playTimer = null;
            this._animateWidth = null;
            this._animateHeight = null;
            this._autoHideTime = null;
            this._mobIconHide = null;
            this._playIconHide = null;
            this._playlistWidth = "32%";
            this._parentElement = null;
            this._youtubeMediaEle = null;
            this._pausedOnSeek = false;
            this._dataSource = null;
            this._repeat = false;
            this._mute = false;
            this._shuffle = false;
            this._subtitle = false;
            this._tochStart = false;
            this._mouseMoveEvt = null;
            this._mouseLeaveEvt = null;
            this._clickEvt = null;
            this._fullScEvt = null;
            this._keyDownEvt = null;
            this._mouseUpEvt = null;
            this._touchStartEvt = null;
            this._touchEndEvt = null;
            this._resizeEvt = null;
            this._pausedManual = false;
            this._timeSliderClick = false;
            this._volSliderClick = false;
            this._hideBasicVol = null;
            this._manualMute = false;
            this._hideVolume = null;
            this._playStarted = null;
            this._isWaitingPopup = null;
            this._sliderAnimation = 100;
            this._animationSpeed = 300;
            this._sliderLeft = null;
            this._isSettingsClick = false;
            this._timeSliderSize = "12px";
            this._touchStarted = false;
            this._localizedLabels = null;
            this._APIKey = "AIzaSyBFRrwfRNr5iTur-fBwexpBG70_P6foPPM&part";
            this._browserInfo = ej.browserInfo();
            this._defaultPosterUrl = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAXEAAAFxCAYAAACFh5ikAAAACXBIWXMAAAsSAAALEgHS3X78AAAJ+UlEQVR42u3dsW8U2R3A8d+bmZ1dy7Kjo0MU/AEpUqdIULpUoIguSKEiRZoUVKlTpknp/AupolCQEqFISGmQIp0ipaG4FKQDAbZ3Zt9MGsZaEIQD1uuZ9ecjWcfdAce9NV//eDM7L/V9H2vqtx8AjE+OiNOIOAt39fav6e7duz959uzZ716/fv3zrutitVpZLoARSClFVVUxn8//88033/zp4cOHf4iIZURE6vs+3bt376dPnz7966tXrw7btrViACON+f7+fly5cuXPjx49+lVELMuqqq49fvz47y9evDg0fQOMW9M00ff9Dx88ePDfO3fu/KN48uTJL05OTg5zzlYHYALevHkTL1++/GVE1MVqtbreNI1VAZiInHMcHx//OCLqwnIATM9wZ6GIA0yYiAOIOAAiDoCIA4g4ACIOgIgDIOIAIg6AiAMg4gAiDoCIAyDiAIg4gIgDIOIAiDgAIg4g4gCIOAAiDiDiAIg4ACIOgIgDiDgAIg6AiAMg4gAiDoCIAyDiACIOgIgDIOIAiDiAiAMg4gCIOICIAyDiAIg4ACIOIOIAiDgAIg6AiAOIOAAiDoCIA4g4ACIOgIgDIOIAIg6AiAMg4gCIOICIAyDiAIg4gIgDIOIAiDgAIg4g4gCIOAAiDoCIA4g4ACIOgIgDiDgAIg6AiAMg4gA7p7IEcLn1fR9d10XXdWffTinFfD63OCIOjDHWQ7Bzzh/8vmVZWjARBy7C+kS9/oGIAyOSc46+788m6iHciDgwEkOY12M9/D2IOIws1u9vhYg1Ig4jjfWnLi6CiMMF+dBELdaIOIzMEGZ3giDiMPJYu7iIiMOIubiIiINYg4jDJri4iIjDBGPt4iIiDiPk4iKIOCO3PlEP4RZrEHFGHGsXF0HEmUCsXVwEEWcCuq6L5XLp4iJsgTM2ObfpGxBxAEQcQMQBEHEARBwAEQcQcQBEHAARBxBxAEQcABEHQMQBRBwAEQdAxAFEHAARB0DEARBxABEHQMQBEHEA3lFZAtgtZVlGURTR932sVisLIuLAGKWUzoI9fKSUzv59zlnERRwYy3SdUjqLdVmWFgURhzFO10Okh8m6KFy6QsRh9NP1+9shIOJgukbEAdM1Ig6maxBxMF2DiIPpGhGHqVqfqk3XiDhMYLpe3xIBEQfTNYg4mK5BxDFdg4jDGNR1fXaHCPCJQccSMNbpGxBxABEHQMQBEHEARBxAxAEQcQBEHEDEARBxAEQcABEHEHEARBwAEQdAxAFEHAARB0DEAUQcABEHQMQBEHEAEYdz/qQsfFqCiDNZKSWLACIOIOIAiDgAIg6AiAOIOAAiDoCIA4g4ACIOgIgDIOIAIg6AiAMg4gCIOICIAyDiAIg4gIgDIOIAiDgAIg4g4gCIOAAiDiDilgBAxAEQcQBEHEDEARBxAEQcABEHEHEARBwAEQcQcQBEHAARB0DEAUQcABEHQMQBEHEAEQdAxAEQcYBLqLIEMD5930fXddH3ffR9/9Hvl1KKlFIURREpJQsn4sBFyDlHzjm6rouc8xf9HEPMy7KMsiwtqogD5zlpD+FerVYb/zmHqCPiwIbj3TRN5Jz/7zbJpv5biDiwwXhvauoGEQfxRsSBj2nbNtq2ta2BiIPpG0Qczl3XdXF6emr6RsRhalarVTRNI+CIOEwx4Mvl0kKwdZ6dAgKOiMPllHMWcEQcpqjvewFHxGGq3IWCiMNEtW0bXddZCEQcpqbv+2jb1kIg4jBF7gVHxGHCU7i30zMm3uzDO4bnXA8fH9v3HU6OKYriUh0NZhsFEWdUU+VwHNhwNNjnxH5dSinKstz5oJvCEXFGEaJNHgt2WbYZtnEaD4g4H41s27axWq1GHaIxT/FuKUTEuZB4T+nZ1kUx3mvtX3oK/RQ5ZFnEGUG8h0ejYhLfpS+miPjOGx7KZP92818YRRwR51w1TeM2OL7acAspIs4Wp8TT01MX3/j6KFSyIOJsVdd1sVwuBRxTuIgzxYB7JCqbMrxpi+lw9WLChi0UATehbmyqqyq3F4o4Ar6jv1l2/I6NlFLMZjMvtIizDU3T2AM3iW/UbDYzhYs42zC8fZ7tR3xXI5dScleKiLMNTpW5+Gl1Fy0WC1O4iLMNTpW5WLt44W8+n3uHpoizDZt+fCyfb9cu/lVVZRtFxNkWAR+H2Wy2E5NrVVUxn8+9oCLONjjbcVzm8/mkt1UEXMQxhV/u3zhFMdkI1nUt4CLOtrknfHzKspxUDFNKsVgsvKFnx7iiYRLna34Dvb1bZezPb6+qKuq6dhuhSRxT+PlPi1OcyPf29kZ5sXOYvqe+h49JfNKcKDONLz57e3vRtm20bXvhr9lwK6StExHHJC7in2E2m0VVVRd2OHVKKeq63ulHBCDijHia3YWHTKWUYj6fR13XZ8+5Oc/JfFi3qqo8C1zE4eLsWoCGqbiu67N32+acNxL0oiiiLMuzD0QcWwwX/8m4w2//Xo9t3/fRdd3ZxxD19W8Pr/uwJTL82CHeIOKMbmq9LHEa/l/FmI0MeZbANsMY1HXthQYR3+EXaoe3VIaLcoCIi7gpHESc8dnVSbWuawcSgIjvvl1880ZVVd5RCCJ+eezStkNRFLZRQMQvl6qqdmLroSgKB/OCiF9OU38anYCDiF/uF2zC2xACDufwJ3RLMMEX7e2dKsvlclK/ZocSgIjzXsibphn188aHh0B5Mw+IOB8IeVEUsVwuR/nMcdM3iDifMOwzr1araJpmNNP3fD73gCcQcb5vNC/6RJnhC8rw6wBEnC+cgOu6jqZpNnYAwSc/iarKqTIg4mw65n3fR8757GNTQV9/HrazHEHEOceYD1NyRETO+Z3TZHLO3+vnGE6YGU6V8cAqEHEuwMdOkxmOC1u3fjQYIOKMfGK3nw3T5M/FACIOgIgDIOIAIg6AiAMg4gCIOICIAyDiAIg4gIgDIOIAiDgAIg4g4gCIOAAiDoCIA4g4ACIOgIgDiDgAIg6AiAMg4gAiDoCIAyDiAIg4gIgDIOIAiDiAiAMg4gCIOAAiDiDiAIg4ACIOIOIAiDgAIg6AiAOIOAAiDoCIAyDiACIOgIgDIOIAIg6AiAMg4gCIOICIAyDiAIg4ACIOIOIAiDgAIg4g4gCIOAAiDoCIA4g4ACIOgIgDIOIAIg6AiAMg4gAiDoCIAyDiAIg4gIgDMKKIF0XxsqoqKwEwESml2Nvb+zYi2uL69et/WSwWkVKyMgATsLe3F/v7+w8joimOjo7+de3atd8eHBwIOcDILRaLODw8/PbGjRt/jIg+9X0fEVHdvHnzN8+fP//9ycnJYc45cs5WC2AEUkpRVVXMZrM4ODj4261bt359//797yIihohHRKSI2L99+/bPjo+Pf9R13Q8sHcBoJvB/Xr169enR0dG/I6IZ/vn/AFDNBWDPII7OAAAAAElFTkSuQmCC";
            this._thumbnailUrl = " data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACsAAAAdCAYAAAAzfpVwAAAACXBIWXMAAAsSAAALEgHS3X78AAAAzUlEQVRYw+3VsW2AMBCF4d++KyzAMjXjpAp9lsh02SJrpEpDAQVYciKDUmUDI2HJN8Gnp/d0Zp7nF+q4LwXegbcnK8/z/BaRVwVY15VlWR4J7bqOaZoUwFLRNWzDNmzD3oQ1xtSDHccRVa0Dq6qEEHDO1dFZay3ee7z3RWtx68CccwzDUAc2pcRxHOUqdgfyui5ijKSUyu6hNDTnzL7v5JyLh1Acu21b+2AN27AN27CVYhUghPDb9/3PI9O0Vowx+R/7ISKfIvLkUCMQ/wAP5C8WF/A5pwAAAABJRU5ErkJggg==";
            this.promise = null;
            this._playQuality = "Auto";
            this.defaults = {
                width: "100%",
                height: "100%",
                toolbarHeight: "45px",
                source: [],
                volume: 50,
                mute: false,
                autoPlay: true,
                autoHide: true,
                shuffle: false,
                repeat: false,
                showPoster: true,
                playSpeed: 1,
                disableKeys: false,
                showTitle: true,
                cssClass: "",
                showPlaylist: false,
                renderMode: screen.width <= 480 ? "mobile" : "basic",
                contentType: "video",
                autoHideTime: 3,
                forwardTime: 10,
                rewindTime: 10,
                playlistTitle: "Playlist",
                locale: "default"
            };
            this.model = this.defaults;
            this.observable = ["value"];
            this.hideWaitingPopup = function () {
                this._hideWaitingPopup();
                this._isWaitingPopup = false;
            };
            this.showWaitingPopup = function () {
                this._isWaitingPopup = true;
                this._showWaitingPopup();
            };
            if (element) {
                if (!element["jquery"]) {
                    element = $("#" + element);
                }
                if (element.length) {
                    return $(element).ejMediaPlayer().data(this.PluginName);
                }
            }
        }
        ejMediaPlayer.prototype._destroy = function () {
            window.clearInterval(this._playTimer);
            window.clearTimeout(this._autoHideTime);
            this._playTimer = null;
            this._autoHideTime = null;
            this._unwireCommonEvents();
            this._removeClass(this._mediaDiv, "e-media-player");
            this._removeClass(this._mediaDiv, "e-media-player");
            this._mediaDiv.innerHTML = "";
        };
        ejMediaPlayer.prototype.setModel = function (opt, forceSet) {
            this.setModel(opt, forceSet);
        };
        ejMediaPlayer.prototype.option = function (opt, forceSet) {
            this.option(opt, forceSet);
        };
        ejMediaPlayer.prototype._setModel = function (options) {
            var option, mediaEle, isYoutube, mediaDiv;
            for (option in options) {
                mediaEle = this._getCurrentMedia();
                isYoutube = this._isYoutubeElement(mediaEle);
                switch (option) {
                    case "width":
                        this.model.width = options[option];
                        this._setModelWidth();
                        break;
                    case "height":
                        this.model.height = options[option];
                        this._setModelHeight();
                        break;
                    case "toolbarHeight":
                        this.model.toolbarHeight = options[option];
                        this._updateToolbarHeight();
                        break;
                    case "renderMode":
                        this.model.renderMode = options[option];
                        this._changeRenderMode(options[option]);
                        break;
                    case "source":
                        this._playlist = this.model.source = options[option];
                        break;
                    case "volume":
                        this.model.volume = options[option];
                        this._setModelVolume(mediaEle, options[option], isYoutube);
                        break;
                    case "mute":
                        this._mute = this.model.mute = options[option];
                        this._setModelMute(mediaEle, options[option], isYoutube);
                        break;
                    case "autoPlay":
                        this.model.autoPlay = options[option];
                        break;
                    case "autoHide":
                        this.model.autoHide = options[option];
                        this._updateToolbarHeight();
                        break;
                    case "shuffle":
                        this._shuffle = this.model.shuffle = options[option];
                        break;
                    case "repeat":
                        this._repeat = this.model.repeat = options[option];
                        break;
                    case "showPoster":
                        this.model.showPoster = options[option];
                        break;
                    case "playSpeed":
                        this.model.playSpeed = options[option];
                        this._setModelSpeed(mediaEle, options[option], isYoutube);
                        break;
                    case "disableKeys":
                        this.model.disableKeys = options[option];
                        break;
                    case "showTitle":
                        this.model.showTitle = options[option];
                        break;
                    case "cssClass":
                        mediaDiv = this._mediaDiv;
                        this._removeClass(mediaDiv, this.model.cssClass);
                        this.model.cssClass = options[option];
                        this._addClass(mediaDiv, options[option]);
                        break;
                    case "showPlaylist":
                        this.model.showPlaylist = options[option];
                        break;
                    case "autoHideTime":
                        this.model.autoHideTime = options[option];
                        break;
                    case "forwardTime":
                        this.model.forwardTime = options[option];
                        break;
                    case "rewindTime":
                        this.model.rewindTime = options[option];
                        break;
                    case "locale":
                        this.model.locale = options[option];
                        this._localizedLabels = ej.getLocalizedConstants("ej.MediaPlayer", options[option]);
                        this._updateLocaleTitles();
                        break;
                }
            }
        };
        ejMediaPlayer.prototype._init = function () {
            if (this._browserInfo.name == "msie" && parseInt(this._browserInfo.version) < 9)
                return;
            if (!ej.isNullOrUndefined(this.element)) {
                this._setHTMLCustomAttributes();
                this._mediaDiv = this.element[0];
                this._localizedLabels = ej.getLocalizedConstants("ej.MediaPlayer", this.model.locale);
                this._setControlId();
                this._initPlaylist();
                this._setMediaTypes();
                this._generatePlayerData();
            }
        };
        ejMediaPlayer.prototype._getLocaleString = function (prop) {
            return this._localizedLabels[prop];
        };
        ejMediaPlayer.prototype._updateLocaleTitles = function () {
            var playIcon, pauseIcon, prevLi, nextLi, prevIcon, nextIcon, hideIcon, toggleIcon;
            playIcon = this._mediaDiv.querySelector(".e-media-center-play");
            pauseIcon = this._mediaDiv.querySelector(".e-media-center-pause");
            prevLi = this._mediaDiv.querySelector(".e-media-prev-li");
            nextLi = this._mediaDiv.querySelector(".e-media-next-li");
            prevIcon = this._mediaDiv.querySelector(".mob-playGroup .e-media-previous");
            nextIcon = this._mediaDiv.querySelector(".mob-playGroup .e-media-next");
            hideIcon = this._mediaDiv.querySelector(".e-media-playlist-close");
            toggleIcon = this._mediaDiv.querySelector(".e-media-playlist-toggle");
            if (playIcon)
                playIcon.title = this._getLocaleString("Play");
            if (pauseIcon)
                pauseIcon.title = this._getLocaleString("Pause");
            if (prevLi)
                prevLi.title = this._getLocaleString("Previous");
            if (nextLi)
                nextLi.title = this._getLocaleString("Next");
            if (prevIcon)
                prevIcon.title = this._getLocaleString("Previous");
            if (nextIcon)
                nextIcon.title = this._getLocaleString("Next");
            if (hideIcon)
                hideIcon.title = this._getLocaleString("HidePlaylist");
            if (toggleIcon)
                toggleIcon.title = this._getLocaleString("TogglePlaylist");
        };
        ejMediaPlayer.prototype._generatePlaylistData = function (data) {
            this._dataSource = data;
            this._renderMediaPlayer();
            this._renderToolbar();
            this._renderTooltip();
            this._renderPlaylist();
            this._initMediaElements();
            this._wireCommonEvents();
        };
        ejMediaPlayer.prototype._setControlId = function () {
            if (!this._mediaDiv.id) {
                var elements = document.getElementsByClassName("e-media-player");
                this._id = "mediaPlayer" + (elements.length + 1);
            }
        };
        ejMediaPlayer.prototype._initPlaylist = function () {
            var sourceArray = this.model.source;
            this._playlist = sourceArray.slice(0, sourceArray.length);
        };
        ejMediaPlayer.prototype._setMediaTypes = function () {
            var url;
            for (var i = 0; i < this._playlist.length; i++) {
                url = this._playlist[i].url;
                if (url && url.trim() != '') {
                    this._playlist[i].url = url;
                    this._playlist[i].type = this._getTypeFromUrl(this._playlist[i].url);
                }
            }
        };
        ejMediaPlayer.prototype._changeRenderMode = function (view) {
            var mediaEle = this._getCurrentMedia(), mobGroup, basicPrev;
            this.model.renderMode = view;
            this._stop(mediaEle);
            window.clearInterval(this._playTimer);
            this._playTimer = null;
            this._mediaDiv.querySelector(".e-media-control-container").remove();
            this._mediaDiv.querySelector(".e-media-settings-popup").remove();
            this._mediaDiv.querySelector(".e-media-time-tooltip").remove();
            mobGroup = this._mediaDiv.querySelector(".e-media-toolbar-ul.mob-playGroup");
            if (mobGroup)
                mobGroup.remove();
            basicPrev = this._mediaDiv.querySelector(".e-media-prev-li.basic");
            if (basicPrev) {
                basicPrev.remove();
                this._mediaDiv.querySelector(".e-media-next-li.basic").remove();
            }
            this._collapsePlaylist();
            this._renderToolbar();
            this._renderTooltip();
            this._updateToolbarHeight();
            this._setMediaDuration(mediaEle);
            this._updateTimeStamp(mediaEle);
            this._mediaDiv.querySelector(".e-media-playlist-container").remove();
            this._mediaDiv.querySelector(".e-media-playlist-toggle").remove();
            this._renderPlaylist();
            if (view == ej.MediaPlayer.RenderMode.Mobile) {
                this._removeClass(this._mediaDiv.querySelector(".e-media-playlist-toggle"), "e-hide");
                this._addClass(this._mediaDiv.querySelector(".e-media-playlist-close"), "e-hide");
            }
            else {
                this._addClass(this._mediaDiv.querySelector(".e-media-playlist-toggle"), "e-hide");
                this._removeClass(this._mediaDiv.querySelector(".e-media-playlist-close"), "e-hide");
            }
            this._setPlaylistVisibility();
            this._updateSettingsSelector("Quality", ej.MediaPlayer.QualityText.Auto);
            this._updateSettingsSelector("Speed", ej.MediaPlayer.SpeedText.Normal);
            this._setQualityItemVisibility(this._isYoutubeElement(mediaEle));
            this._disablePrevNextIcons();
        };
        ejMediaPlayer.prototype._getTypeFromUrl = function (url) {
            if (this._isVaildYoutubeUrl(url))
                return ej.MediaPlayer.Types.Youtube;
            else if (this._isVaildVideoUrl(url))
                return ej.MediaPlayer.Types.Video;
            else if (this._isVaildAudioUrl(url))
                return ej.MediaPlayer.Types.Audio;
        };
        ejMediaPlayer.prototype._isVaildVideoUrl = function (url) {
            var ext = this._getExtensionFromUrl(url);
            if (ext == "mp4" || ext == "webm" || ext == "ogg" || ext == "ogv")
                return true;
        };
        ejMediaPlayer.prototype._isVaildAudioUrl = function (url) {
            var ext = this._getExtensionFromUrl(url);
            if (ext == "mp3" || ext == "wav")
                return true;
        };
        ejMediaPlayer.prototype._isVaildYoutubeUrl = function (url) {
            var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/, match = url.match(regExp);
            if (match && match[2].length == 11) {
                return true;
            }
        };
        ejMediaPlayer.prototype._getExtensionFromUrl = function (url) {
            var parts = url.split('.');
            return parts[parts.length - 1];
        };
        ejMediaPlayer.prototype._initMediaElements = function () {
            var playGroup;
            this._setModelWidth();
            this._setModelHeight();
            this._setAllMediaProperties();
            if (this.model.showPlaylist)
                this._setPlaylistVisibility();
            this._updateToolbarHeight();
            this._handleAutoHide(null);
            this._updateSettingsSelector("Quality", ej.MediaPlayer.QualityText.Auto);
            this._setLowPriorityIconsVisibility();
            this._fadeMobileIcons();
            this._fadeBasicIcons();
            this._fadePlayIcon();
            this._updateAudioContent();
            playGroup = this._mediaDiv.querySelector(".e-media-toolbar-playgroup");
            if (playGroup)
                playGroup.style.width = "auto";
        };
        ejMediaPlayer.prototype._renderMediaPlayer = function () {
            var mediaId = this._id, mediaDiv = this._mediaDiv, mediaEleDiv, mediaContentDiv, videoBaner, videoTitle, audioDetails, posterImg, audioTitle, overLayDiv, mediaSource, customFullscreenDiv;
            this._mediaIndex = 0;
            this._addClass(mediaDiv, "e-media-player");
            this._addClass(mediaDiv, "e-media-mouse");
            mediaEleDiv = this._createElement("div", mediaId + "_mediaEleDiv", "e-media-element-div", false);
            mediaDiv.appendChild(mediaEleDiv);
            this._mediaDiv.setAttribute("tabindex", "0");
            mediaContentDiv = this._createElement("div", mediaId + "_mediaContentDiv", "e-media-content-div", false);
            mediaEleDiv.appendChild(mediaContentDiv);
            videoBaner = this._createElement("div", mediaId + "_vBaner", "e-media-video-baner", false);
            videoTitle = this._createElement("div", mediaId + "_vTitle", "e-media-video-title", false);
            videoBaner.appendChild(videoTitle);
            mediaDiv.appendChild(videoBaner);
            audioDetails = this._createElement("div", mediaId + "_aDetail", "e-media-audio-detail e-hide", false);
            posterImg = this._createElement("img", mediaId + "_poster", "e-media-audio-poster", false);
            audioDetails.appendChild(posterImg);
            audioTitle = this._createElement("div", mediaId + "_aTitle", "e-media-audio-title", false);
            audioDetails.appendChild(audioTitle);
            mediaContentDiv.appendChild(audioDetails);
            this._addCenterPlayBtn(mediaContentDiv);
            this._addCssClass();
            overLayDiv = this._createElement("div", mediaId + "_overlay", "e-media-overlay", false);
            mediaDiv.querySelector(".e-media-content-div").appendChild(overLayDiv);
            mediaSource = this._playlist;
            if (mediaSource.length > 0)
                this._renderElementByType(mediaDiv, mediaSource);
            else
                this._renderVideoElement(mediaDiv);
            customFullscreenDiv = this._createElement("div", mediaId + "_customFullScreen", "e-media-custom-fullscreen e-hide", false);
            document.body.appendChild(customFullscreenDiv);
            mediaDiv.querySelector(".e-media-content-div").style.width = "100%";
        };
        ejMediaPlayer.prototype._addCssClass = function () {
            this._addClass(this._mediaDiv, this.model.cssClass);
        };
        ejMediaPlayer.prototype._addCenterPlayBtn = function (mediaContentDiv) {
            var mediaId = this._id, playIcon, playAnimation, ins = this;
            playIcon = this._createElement("div", mediaId + "_centerPlay", "e-media-toolbar-icon e-media-center-icon e-media-center-play e-icon", false);
            playAnimation = this._createElement("div", mediaId + "_cPlayAnimation", "e-media-play-animation center e-hide", false);
            playIcon.appendChild(playAnimation);
            playIcon.title = this._getLocaleString("Play");
            mediaContentDiv.appendChild(playIcon);
            playIcon.addEventListener("click", function (evt) {
                ins._preventDefault(evt);
                ins._mediaToolBarClick(evt, false);
            });
            playIcon.addEventListener("touchend", function (evt) {
                if (ins._allowTouchEvent(evt)) {
                    ins._preventDefault(evt);
                    ins._mediaToolBarClick(evt, true);
                }
            });
        };
        ejMediaPlayer.prototype._renderYTPlayer = function (elementId) {
            var ins = this, tag, firstScriptTag;
            if (typeof (YT) == 'undefined' || typeof (YT.Player) == 'undefined') {
                tag = document.createElement('script');
                tag.src = "https://www.youtube.com/iframe_api";
                firstScriptTag = document.getElementsByTagName('script')[0];
                firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
                window.onYouTubeIframeAPIReady = function () {
                    ins._renderYTPlayerProgress(elementId);
                };
            }
            else
                this._renderYTPlayerProgress(elementId);
        };
        ejMediaPlayer.prototype._renderYTPlayerProgress = function (elementId) {
            var ins = this, firstSource = this._playlist[0], videoId = " ";
            if (firstSource && firstSource.type == ej.MediaPlayer.Types.Youtube)
                videoId = this._getYTVideoIdFromUrl(firstSource.url);
            ins._processYoutubeAPI("destroy", null);
            new YT.Player(elementId, {
                videoId: videoId,
                playerVars: {
                    'controls': 0,
                    'wmode': 'transparent',
                    'rel': 0,
                    'autohide': 1,
                    'showinfo': 0,
                    'enablejsapi': 1,
                    'cc_load_policy': 1,
                    'fs': 1
                },
                events: {
                    "onReady": function (evt) {
                        ins._onYoutubePlayerReady(evt);
                    },
                    "onStateChange": function (evt) {
                        ins._onYoutubeStateChange(evt);
                    }
                }
            });
        };
        ejMediaPlayer.prototype._renderElementByType = function (mediaDiv, source) {
            var mediaPlayerTypes = ej.MediaPlayer.Types;
            for (var i = 0; i < source.length; i++) {
                if (source[i].type == mediaPlayerTypes.Video)
                    this._renderVideoElement(mediaDiv);
                else if (source[i].type == mediaPlayerTypes.Audio)
                    this._renderAudioElement(mediaDiv);
                else
                    this._renderYoutubeElement(mediaDiv);
            }
        };
        ejMediaPlayer.prototype._renderVideoElement = function (mediaDiv) {
            var mediaId = mediaDiv.id, ins = this, videoEle, sourceEle, trackEle;
            if (!document.getElementById(mediaId + "_video")) {
                videoEle = this._createElement("video", mediaId + "_video", "e-media-element e-media-video", false);
                mediaDiv.querySelector(".e-media-content-div").appendChild(videoEle);
                sourceEle = this._createElement("source", mediaId + "_video_source", "e-media-video-source", false);
                sourceEle.setAttribute("type", "video/mp4");
                trackEle = this._createElement("track", mediaId + "_video_track", "e-media-video-track", false);
                videoEle.appendChild(sourceEle);
                videoEle.appendChild(trackEle);
                videoEle.setAttribute("preload", "none");
                videoEle.addEventListener("playing", function () {
                    ins._playStarted = false;
                    ins.hideWaitingPopup();
                }, false);
                videoEle.addEventListener("waiting", function () {
                    ins.showWaitingPopup();
                }, false);
                videoEle.addEventListener("canplaythrough", function () {
                    ins.hideWaitingPopup();
                }, false);
            }
        };
        ejMediaPlayer.prototype._renderAudioElement = function (mediaDiv) {
            var mediaId = mediaDiv.id, audioEle, sourceEle;
            if (!document.getElementById(mediaId + "_audio")) {
                audioEle = this._createElement("audio", mediaId + "_audio", "e-media-element e-media-audio e-hide", false);
                mediaDiv.querySelector(".e-media-content-div").appendChild(audioEle);
                sourceEle = this._createElement("source", mediaId + "_audio_source", "e-media-audio-source", false);
                sourceEle.setAttribute("type", "audio/mp3");
                audioEle.appendChild(sourceEle);
            }
        };
        ejMediaPlayer.prototype._renderYoutubeElement = function (mediaDiv) {
            var mediaId = mediaDiv.id, youtubeEle;
            if (!document.getElementById(mediaId + "_youtube")) {
                youtubeEle = this._createElement("div", mediaId + "_youtube", "e-media-element e-media-youtube e-hide", false);
                mediaDiv.querySelector(".e-media-content-div").appendChild(youtubeEle);
            }
        };
        ejMediaPlayer.prototype._renderToolbar = function () {
            var mediaId = this._id, ins = this, controlContainer;
            controlContainer = this._createElement("div", mediaId + "_controlContainer", "e-media-control-container", false);
            this._mediaDiv.appendChild(controlContainer);
            if (this.model.contentType == ej.MediaPlayer.ContentType.Audio) {
                this._renderBasicToolbar(controlContainer);
                this._addClass(this._mediaDiv.querySelector(".e-media-toolbar"), "audio");
            }
            else {
                if (this.model.renderMode == ej.MediaPlayer.RenderMode.Advanced)
                    this._renderAdvancedToolbar(controlContainer);
                else if (this.model.renderMode == ej.MediaPlayer.RenderMode.Mobile)
                    this._renderMobileToolbar(controlContainer);
                else
                    this._renderBasicToolbar(controlContainer);
            }
            this._renderSettingspopup();
        };
        ejMediaPlayer.prototype._getToolIconsTooltip = function (selectedElement) {
            if (this._containsClass(selectedElement, "e-media-play"))
                return this._getLocaleString("Play");
            else if (this._containsClass(selectedElement, "e-media-pause"))
                return this._getLocaleString("Pause");
            else if (this._containsClass(selectedElement, "e-media-forward"))
                return this._getLocaleString("Forward");
            else if (this._containsClass(selectedElement, "e-media-backward"))
                return this._getLocaleString("Rewind");
            else if (this._containsClass(selectedElement, "e-media-next"))
                return this._getLocaleString("Next");
            else if (this._containsClass(selectedElement, "e-media-previous"))
                return this._getLocaleString("Previous");
            else if (this._containsClass(selectedElement, "e-media-shuffle"))
                return this._getLocaleString("Shuffle");
            else if (this._containsClass(selectedElement, "e-media-repeat"))
                return this._getLocaleString("RepeatPlaylist");
            else if (this._containsClass(selectedElement, "e-media-volume")) {
                if (this._containsClass(selectedElement, "media-muted"))
                    return this._getLocaleString("Unmute");
                else
                    return this._getLocaleString("Mute");
            }
            else if (this._containsClass(selectedElement, "e-media-fullscreen"))
                return this._getLocaleString("FullScreen");
            else if (this._containsClass(selectedElement, "e-media-smallscreen"))
                return this._getLocaleString("ExitFullScreen");
            else if (this._containsClass(selectedElement, "e-media-settings"))
                return this._getLocaleString("Settings");
            else if (this._containsClass(selectedElement, "e-media-playlist"))
                return this._getLocaleString("Playlist");
        };
        ejMediaPlayer.prototype._renderTooltip = function () {
            var tooltip, ins = this, slider, sliderWrap, touch, time, toolBar, value;
            tooltip = this._createElement("div", this._id + "_tooltip", "e-media-time-tooltip e-hide");
            this._mediaDiv.appendChild(tooltip);
            ins = this;
            slider = this._mediaDiv.querySelector(".e-media-timeslider");
            sliderWrap = slider.parentNode;
            sliderWrap.addEventListener("mousemove", function (evt) {
                touch = false;
                if (evt.movementX == 0 && evt.movementY == 0)
                    touch = true;
                if (!touch && ins._containsClass(ins._mediaDiv.querySelector(".e-media-settings-popup"), "e-hide")) {
                    time = ins._getHoverTime(evt);
                    tooltip.innerHTML = ins._getTimeFromSeconds(time);
                    if (ins._isValidTooltipTime(time))
                        ins._setTooltipPosition(evt);
                    else
                        ins._addClass(tooltip, "e-hide");
                }
                else
                    ins._addClass(tooltip, "e-hide");
            });
            sliderWrap.addEventListener("mouseleave", function (evt) {
                ins._addClass(tooltip, "e-hide");
            });
            toolBar = this._mediaDiv.querySelector(".e-media-toolbar");
            toolBar.addEventListener("mousemove", function (evt) {
                value = ins._getToolIconsTooltip(evt.target);
                touch = false;
                if (evt.movementX == 0 && evt.movementY == 0)
                    touch = true;
                if (!touch && value && ins._containsClass(ins._mediaDiv.querySelector(".e-media-settings-popup"), "e-hide") && (ins._containsClass(evt.target, "e-media-toolbar-icon") || ins._closest(evt.target, ".e-media-toolbar-icon"))) {
                    tooltip.innerHTML = value;
                    ins._setTooltipPosition(evt);
                }
                else if (!ins._containsClass(evt.target, "e-slider-wrap") && !ins._closest(evt.target, ".e-slider-wrap"))
                    ins._addClass(tooltip, "e-hide");
            });
            toolBar.addEventListener("mouseleave", function (evt) {
                ins._addClass(tooltip, "e-hide");
            });
        };
        ejMediaPlayer.prototype._isValidTooltipTime = function (time) {
            if (time == 0 && this._mediaDiv.querySelector(".e-media-timeslider").querySelector(".e-handle").style.left != "0%")
                return false;
            return true;
        };
        ejMediaPlayer.prototype._hideTooltip = function () {
            this._addClass(this._mediaDiv.querySelector(".e-media-time-tooltip"), "e-hide");
        };
        ejMediaPlayer.prototype._setTooltipPosition = function (evt) {
            var tooltip, slider, mediaBounds, toolBounds, tooltipBounds, newLeft;
            tooltip = this._mediaDiv.querySelector(".e-media-time-tooltip");
            this._removeClass(tooltip, "e-hide");
            slider = this._mediaDiv.querySelector(".e-media-timeslider");
            mediaBounds = this._mediaDiv.getBoundingClientRect();
            toolBounds = this._mediaDiv.querySelector(".e-media-control-container").getBoundingClientRect();
            tooltipBounds = tooltip.getBoundingClientRect();
            newLeft = evt.clientX - toolBounds.left - tooltipBounds.width / 2;
            if (this.model.renderMode == ej.MediaPlayer.RenderMode.Basic && !this._containsClass(this._mediaDiv.querySelector(".e-media-toolbar-volume-li"), "e-hide"))
                newLeft -= 35;
            if ((newLeft + toolBounds.left) >= toolBounds.left && (newLeft + tooltipBounds.width) <= (toolBounds.width + toolBounds.left)) {
                if (Math.abs(newLeft + tooltipBounds.width) > Math.abs(toolBounds.width))
                    newLeft = toolBounds.width - tooltipBounds.width;
                tooltip.style.left = newLeft + "px";
            }
            tooltip.style.top = (toolBounds.top - mediaBounds.top - tooltipBounds.height - 5) + "px";
        };
        ejMediaPlayer.prototype._updateAudioContent = function () {
            if (this.model.contentType == ej.MediaPlayer.ContentType.Audio) {
                this._addClass(this._mediaDiv.querySelector(".e-media-playlist-container"), "e-hide");
                this._addClass(this._mediaDiv.querySelector(".e-media-video-baner"), "e-hide");
                this._addClass(this._mediaDiv.querySelector(".e-media-playlist-toggle"), "e-hide");
                this._addClass(this._mediaDiv.querySelector(".e-media-toolbar-settings-li"), "e-hide");
                this._addClass(this._mediaDiv.querySelector(".e-media-toolbar-fullscreen-li"), "e-hide");
                this._mediaDiv.style.height = this.model.toolbarHeight;
                this._mediaDiv.querySelector(".e-media-control-container").style.width = "100%";
            }
        };
        ejMediaPlayer.prototype._updateToolbarHeight = function () {
            var mediaDiv = this._mediaDiv, height = this.model.toolbarHeight, contentDiv, banerHeight, containerHeight, popupIns;
            mediaDiv.querySelector(".e-media-control-container").style.height = height;
            contentDiv = mediaDiv.querySelector(".e-media-content-div");
            banerHeight = mediaDiv.querySelector(".e-media-video-baner").getBoundingClientRect().height;
            if (!this.model.autoHide) {
                var containerHeight = mediaDiv.querySelector(".e-media-control-container").getBoundingClientRect().height;
                contentDiv.style.height = "calc(100% - " + (containerHeight + banerHeight) + "px)";
                contentDiv.style.top = banerHeight + "px";
            }
            else {
                contentDiv.style.top = "0px";
                contentDiv.style.height = "100%";
            }
            popupIns = this._getEJControlInstance(this._mediaDiv.querySelector(".e-media-content-div"), "WaitingPopup");
            if (popupIns)
                popupIns.setModel({ appendTo: ".e-media-content-div" });
        };
        ejMediaPlayer.prototype._allowTouchEvent = function (evt) {
            if (!this._closest(evt.target, ".e-slider-wrap"))
                return false;
            else if (this._browserInfo.name == "chrome" && this._containsClass(this._closest(evt.target, '.e-media-toolbar-icon'), "e-media-fullscreen"))
                return false;
            return true;
        };
        ejMediaPlayer.prototype._renderBasicToolbar = function (controlContainer) {
            var mediaId = this._id, ins = this, toolbar;
            toolbar = this._createElement("div", mediaId + "_playerToolbar", "e-media-toolbar basic", false);
            controlContainer.appendChild(toolbar);
            this._renderBasicToolbarControls(toolbar);
            toolbar.addEventListener("click", function (evt) {
                if (!ins._closest(evt.target, ".e-slider-wrap"))
                    ins._preventDefault(evt);
                ins._mediaToolBarClick(evt, false);
            });
            toolbar.addEventListener("touchend", function (evt) {
                if (ins._allowTouchEvent(evt)) {
                    if (!ins._closest(evt.target, ".e-slider-wrap"))
                        ins._preventDefault(evt);
                    ins._mediaToolBarClick(evt, true);
                }
            });
            this._renderTimeSlider(this._mediaDiv.querySelector(".e-media-timeslider"));
            this._renderBasicVolSlider(this._mediaDiv.querySelector(".e-media-volume-slider"));
        };
        ejMediaPlayer.prototype._renderBasicVolSlider = function (volumeSlider) {
            var ins = this;
            this._renderEJControls(volumeSlider, "Slider", {
                showRoundedCorner: true,
                allowMouseWheel: true,
                animationSpeed: ins._sliderAnimation,
                orientation: ej.Orientation.Vertical,
                sliderType: ej.SliderType.MinRange,
                maxValue: 100, value: ins.model.volume || 50,
                width: 15,
                height: 60, incrementStep: 1
            });
            this._wireVolumeSliderEvts(volumeSlider);
        };
        ejMediaPlayer.prototype._autoHideBasicVolSlider = function () {
            var ins = this, hideTime;
            hideTime = parseInt(this.model.autoHideTime.toString()) * 1000;
            window.clearTimeout(this._hideBasicVol);
            this._hideBasicVol = setTimeout(function () {
                ins._hideBasicVolSlider();
            }, hideTime);
        };
        ejMediaPlayer.prototype._renderBasicToolbarControls = function (toolbar) {
            var mediaId = this._id, ins = this, basicUlItem, prevLiItem, previousIcon, playLiItem, playIcon, nextLiItem, nextIcon, timeStartTextLiItem, timeStampRun, timeLiItem, timeSlider, volumeSliderLiItem, volumeSliderIcon, timeTextLiItem, timeStamp, rightLiItem, volumeLiItem, volumeIcon, settingsLiItem, settingsIcon, fullscreenLiItem, fullscreenIcon, ins = this, sliderLi;
            basicUlItem = this._createElement("ul", mediaId + "_basicUl", "e-media-toolbar-ul", false);
            prevLiItem = this._createElement("div", mediaId + "_previousLi", "e-media-toolbar-li e-media-prev-li basic", false);
            previousIcon = this._createElement("div", mediaId + "_previousIcon", "e-media-toolbar-icon e-media-previous basic e-icon", false);
            prevLiItem.appendChild(previousIcon);
            prevLiItem.title = this._getLocaleString("Previous");
            playLiItem = this._createElement("li", mediaId + "_playLi", "e-media-toolbar-li e-media-play-li", false);
            playIcon = this._createElement("div", mediaId + "_playIcon", "e-media-toolbar-icon e-media-play e-icon", false);
            playLiItem.appendChild(playIcon);
            nextLiItem = this._createElement("div", mediaId + "_nextLi", "e-media-toolbar-li e-media-next-li basic", false);
            nextIcon = this._createElement("div", mediaId + "_nextIcon", "e-media-toolbar-icon e-media-next basic e-icon", false);
            nextLiItem.appendChild(nextIcon);
            nextLiItem.title = this._getLocaleString("Next");
            timeStartTextLiItem = this._createElement("li", mediaId + "_timeStartTextLi", "e-media-toolbar-li e-media-toolbar-time-run-li", false);
            timeStampRun = this._createElement("div", mediaId + "_timeStamp", "e-media-time-stamp-run e-media-basic", false);
            timeStartTextLiItem.appendChild(timeStampRun);
            timeLiItem = this._createElement("li", mediaId + "_timeLi", "e-media-toolbar-li e-media-time-li", false);
            timeSlider = this._createElement("div", mediaId + "_timeSlider", "e-media-timeslider e-media-basic", false);
            timeLiItem.appendChild(timeSlider);
            volumeSliderLiItem = this._createElement("div", mediaId + "_volumeSliderLi", "e-media-toolbar-volume-li e-media-vol-slider-li e-hide", false);
            volumeSliderIcon = this._createElement("div", mediaId + "_volumeSliderIcon", "e-media-volume-slider", false);
            volumeSliderLiItem.appendChild(volumeSliderIcon);
            timeTextLiItem = this._createElement("li", mediaId + "_timeTextLi", "e-media-toolbar-li e-media-toolbar-time-icon-li", false);
            timeStamp = this._createElement("div", mediaId + "_timeStamp", "e-media-time-stamp-end e-media-basic", false);
            timeTextLiItem.appendChild(timeStamp);
            rightLiItem = this._createElement("li", mediaId + "_rightLi", "e-media-toolbar-li e-media-toolbar-right-li", false);
            volumeLiItem = this._createElement("div", mediaId + "_volumeLi", "e-media-toolbar-right-div e-media-toolbar-volume-icon-li e-media-lp-icons", false);
            volumeIcon = this._createElement("div", mediaId + "_volumeIcon", "e-media-toolbar-icon e-media-volume e-icon", false);
            volumeLiItem.appendChild(volumeIcon);
            rightLiItem.appendChild(volumeLiItem);
            settingsLiItem = this._createElement("div", mediaId + "_settingsLi", "e-media-toolbar-right-div e-media-toolbar-settings-li e-media-lp-icons", false);
            settingsIcon = this._createElement("div", mediaId + "_settingsIcon", "e-media-toolbar-icon e-media-settings e-icon", false);
            settingsLiItem.appendChild(settingsIcon);
            rightLiItem.appendChild(settingsLiItem);
            fullscreenLiItem = this._createElement("div", mediaId + "_fullscreenLi", "e-media-toolbar-right-div e-media-toolbar-fullscreen-li", false);
            fullscreenIcon = this._createElement("div", mediaId + "_fullscreenIcon", "e-media-toolbar-icon e-media-fullscreen e-icon", false);
            fullscreenLiItem.appendChild(fullscreenIcon);
            rightLiItem.appendChild(fullscreenLiItem);
            basicUlItem.appendChild(playLiItem);
            if (this.model.contentType != ej.MediaPlayer.Types.Audio) {
                this._mediaDiv.querySelector(".e-media-content-div").appendChild(prevLiItem);
                this._mediaDiv.querySelector(".e-media-content-div").appendChild(nextLiItem);
            }
            basicUlItem.appendChild(timeLiItem);
            basicUlItem.appendChild(timeStartTextLiItem);
            basicUlItem.appendChild(timeTextLiItem);
            basicUlItem.appendChild(rightLiItem);
            toolbar.appendChild(basicUlItem);
            toolbar.appendChild(volumeSliderLiItem);
            this._mediaDiv.querySelector(".e-media-toolbar.basic").querySelector(".e-media-volume").addEventListener("touchstart", function (evt) {
                evt.preventDefault();
                sliderLi = ins._mediaDiv.querySelector(".e-media-vol-slider-li");
                if (ins._containsClass(sliderLi, "e-hide"))
                    ins._showBasicVolSlider();
                else
                    ins._handleMuteBtnClick(ins._getCurrentMedia(), this);
            });
            ins._basicHoverIconEvents(prevLiItem);
            ins._basicHoverIconEvents(nextLiItem);
        };
        ejMediaPlayer.prototype._basicHoverIconEvents = function (hoverItem) {
            var ins = this;
            hoverItem.addEventListener("click", function (evt) {
                ins._preventDefault(evt);
                ins._mediaToolBarClick(evt, false);
            });
            hoverItem.addEventListener("touchend", function (evt) {
                if (!ins._closest(evt.target, ".e-slider-wrap"))
                    ins._preventDefault(evt);
                ins._mediaToolBarClick(evt, false);
            });
        };
        ejMediaPlayer.prototype._showBasicVolSlider = function () {
            var mediaDiv = this._mediaDiv, basicToolbar, sliderLi, volumeBounds;
            basicToolbar = mediaDiv.querySelector(".e-media-toolbar.basic");
            if (basicToolbar && this._containsClass(this._mediaDiv.querySelector(".e-media-settings-popup"), "e-hide")) {
                sliderLi = basicToolbar.querySelector(".e-media-vol-slider-li");
                this._removeClass(sliderLi, "e-hide");
                volumeBounds = basicToolbar.querySelector(".e-media-volume").getBoundingClientRect();
                sliderLi.style.left = (volumeBounds.left - mediaDiv.getBoundingClientRect().left).toString() + "px";
                this._autoHideBasicVolSlider();
            }
        };
        ejMediaPlayer.prototype._hideBasicVolSlider = function () {
            var basicToolbar = this._mediaDiv.querySelector(".e-media-toolbar.basic"), volSlider;
            if (basicToolbar) {
                volSlider = basicToolbar.querySelector(".e-media-vol-slider-li");
                if (!this._closest(document.activeElement, ".e-media-vol-slider-li") && !this._containsClass(volSlider, "e-hide"))
                    this._addClass(volSlider, "e-hide");
            }
        };
        ejMediaPlayer.prototype._renderAdvancedToolbar = function (controlContainer) {
            var mediaId = this._id, ins = this, timeSliderDiv, timeSlider, timeStamp, runTime, endTime, toolbar;
            timeSliderDiv = this._createElement("div", mediaId + "_timeSliderDiv", "e-media-time-li e-media-timeslider-div e-media-adv", false);
            timeSlider = this._createElement("div", mediaId + "_timeSlider", "e-media-timeslider e-media-adv", false);
            timeSliderDiv.appendChild(timeSlider);
            timeStamp = this._createElement("div", mediaId + "_timeStamp", "e-media-time-stamp e-media-adv", false);
            runTime = this._createElement("div", mediaId + "_timeStamp_run", "e-media-time-stamp-run e-media-adv", false);
            endTime = this._createElement("div", mediaId + "_timeStamp_end", "e-media-time-stamp-end e-media-adv", false);
            timeStamp.appendChild(runTime);
            timeStamp.appendChild(endTime);
            controlContainer.appendChild(timeSliderDiv);
            controlContainer.appendChild(timeStamp);
            this._renderTimeSlider(timeSlider);
            toolbar = this._createElement("div", mediaId + "_playerToolbar", "e-media-toolbar adv", false);
            this._renderToolbarControls(toolbar);
            toolbar.addEventListener("click", function (evt) {
                if (!ins._closest(evt.target, ".e-slider-wrap"))
                    ins._preventDefault(evt);
                ins._mediaToolBarClick(evt, false);
            });
            toolbar.addEventListener("touchend", function (evt) {
                if (ins._allowTouchEvent(evt)) {
                    if (!ins._closest(evt.target, ".e-slider-wrap"))
                        ins._preventDefault(evt);
                    ins._mediaToolBarClick(evt, false);
                }
            });
            controlContainer.appendChild(toolbar);
            controlContainer.style.minHeight = "70px";
            this._renderVolumeSlider(toolbar.querySelector("#" + mediaId + "_volumeSliderIcon"));
        };
        ejMediaPlayer.prototype._setLowPriorityIconsVisibility = function () {
            var control, minWidth, controlWidth, icons, toolbar, settingsIcon;
            control = this._mediaDiv.querySelector(".e-media-control-container");
            if (this.model.renderMode == ej.MediaPlayer.RenderMode.Advanced)
                minWidth = 450;
            else if (this.model.renderMode == ej.MediaPlayer.RenderMode.Basic)
                minWidth = 350;
            if (minWidth) {
                controlWidth = this._mediaDiv.querySelector(".e-media-content-div").getBoundingClientRect().width;
                icons = control.querySelectorAll(".e-media-lp-icons");
                for (var i = 0; i < icons.length; i++) {
                    if (controlWidth < minWidth)
                        this._addClass(icons[i], "e-hide");
                    else
                        this._removeClass(icons[i], "e-hide");
                }
                if (this.model.renderMode == ej.MediaPlayer.RenderMode.Basic) {
                    toolbar = this._mediaDiv.querySelector(".e-media-toolbar");
                    if (controlWidth < minWidth)
                        this._addClass(toolbar, "fullscreen");
                    else
                        this._removeClass(toolbar, "fullscreen");
                }
                else {
                    settingsIcon = control.querySelector(".e-media-lp-set-icon");
                    if (controlWidth < 250)
                        this._addClass(settingsIcon, "e-hide");
                    else
                        this._removeClass(settingsIcon, "e-hide");
                }
            }
        };
        ejMediaPlayer.prototype._renderVolumeSlider = function (volumeSlider) {
            var ins = this;
            this._renderEJControls(volumeSlider, "Slider", {
                showRoundedCorner: true,
                animationSpeed: ins._sliderAnimation,
                sliderType: ej.SliderType.MinRange,
                maxValue: 100, value: ins.model.volume || 50,
                height: 6, incrementStep: 1
            });
            this._wireVolumeSliderEvts(volumeSlider);
        };
        ejMediaPlayer.prototype._wireVolumeSliderEvts = function (volumeSlider) {
            var ins = this, wrapper = this._closest(volumeSlider, ".e-slider-wrap");
            wrapper.addEventListener("mousedown", function (evt) {
                ins._volSliderClick = true;
            });
            wrapper.addEventListener("touchstart", function (evt) {
                ins._volSliderClick = true;
            });
            wrapper.addEventListener("MSPointerDown", function (evt) {
                if (evt.pointerType == "touch")
                    ins._volSliderClick = true;
            });
            wrapper.addEventListener("touchmove", function (evt) {
                ins._volSliderTouchMove(evt);
            });
            wrapper.addEventListener("MSPointerMove", function (evt) {
                if (evt.pointerType == "touch")
                    ins._volSliderTouchMove(evt);
            });
        };
        ejMediaPlayer.prototype._volSliderTouchMove = function (evt) {
            var volume = this._getTouchVolume(evt), sliderIns;
            sliderIns = this._getEJControlInstance(evt.target.querySelector(".e-media-volume-slider"), "Slider");
            if (sliderIns && volume) {
                sliderIns.option("value", volume);
            }
        };
        ejMediaPlayer.prototype._getTouchVolume = function (evt) {
            var maxVol = 100, slider, time;
            slider = this._closest(evt.target, ".e-media-timeslider") || evt.target.querySelector(".e-media-timeslider");
            if (slider) {
                time = ((evt.touches[0].clientX - slider.getBoundingClientRect().left) / slider.getBoundingClientRect().width) * parseInt(maxVol);
                if (time > maxVol)
                    time = maxVol;
                return time;
            }
        };
        ejMediaPlayer.prototype._renderTimeSlider = function (timeSlider) {
            var ins = this, animationSpeed = this._sliderAnimation, wrapper, head;
            this._renderEJControls(timeSlider, "Slider", {
                showRoundedCorner: true,
                animationSpeed: animationSpeed,
                showTooltip: false,
                sliderType: ej.SliderType.MinRange,
                maxValue: 100,
                width: "100%", height: "20px", incrementStep: 1
            });
            wrapper = this._closest(timeSlider, ".e-slider-wrap");
            head = wrapper.querySelector(".e-handle");
            this._sliderLeft = parseFloat(head.style.marginLeft) + parseFloat(this._timeSliderSize) / 2 + "px";
            if (this.model.renderMode == ej.MediaPlayer.RenderMode.Basic)
                this._sliderLeft = parseFloat(this._sliderLeft) + parseFloat(this._timeSliderSize) + "px";
            wrapper.addEventListener("mousedown", function (evt) {
                ins._timeSliderMouseDown(evt);
            });
            wrapper.addEventListener("touchstart", function (evt) {
                ins._setSliderHeaderSize(head);
                setTimeout(function () {
                    ins._removeClass(head, "e-hide");
                    head.style.display = "block";
                }, ins._animationSpeed);
                ins._timeSliderMouseDown(evt);
            });
            wrapper.addEventListener("MSPointerDown", function (evt) {
                if (evt.pointerType == "touch") {
                    ins._setSliderHeaderSize(head);
                    setTimeout(function () {
                        ins._removeClass(head, "e-hide");
                        head.style.display = "block";
                    }, ins._animationSpeed);
                    ins._timeSliderMouseDown(evt);
                }
            });
            wrapper.addEventListener("touchmove", function (evt) {
                ins._timeSliderTouchMove(evt);
            });
            wrapper.addEventListener("MSPointerMove", function (evt) {
                if (evt.pointerType == "touch")
                    ins._timeSliderTouchMove(evt);
            });
            wrapper.addEventListener("mouseenter", function (evt) {
                ins._showTimeSliderHead(this);
            });
            if (this._browserInfo.name.toLowerCase() != "msie") {
                wrapper.addEventListener("mouseleave", function (evt) {
                    ins._hideTimeSliderHead(this);
                });
            }
            wrapper.addEventListener("MSPointerLeave", function (evt) {
                if (evt.pointerType != "touch")
                    ins._hideTimeSliderHead(this);
            });
            wrapper.addEventListener("mousemove", function (evt) {
                if (ins._containsClass(head, "e-hide")) {
                    ins._stopAnimation(head);
                    head.style.width = head.style.height = ins._timeSliderSize;
                    head.style.top = "-50%";
                    head.style.marginLeft = ins._sliderLeft;
                    ins._removeClass(head, "e-hide");
                }
            });
            this._addClass(head, "e-hide");
            this._hideTimeSliderHead(wrapper);
        };
        ejMediaPlayer.prototype._setSliderHeaderSize = function (head) {
            if (this._containsClass(head, "e-hide")) {
                head.style.width = head.style.height = this._timeSliderSize;
                head.style.top = "-50%";
                this._removeClass(head, "e-hide");
            }
        };
        ejMediaPlayer.prototype._showTimeSliderHead = function (wrapper) {
            var head = wrapper.querySelector(".e-handle");
            this._stopAnimation(head);
            head.style.width = head.style.height = "0px";
            this._removeClass(head, "e-hide");
            this._animate(head, { "width": this._timeSliderSize, "height": this._timeSliderSize, "top": "-50%", "margin-left": this._sliderLeft }, 100, null);
        };
        ejMediaPlayer.prototype._hideTimeSliderHead = function (wrapper) {
            var head, ins = this, left, top;
            head = wrapper.querySelector(".e-handle");
            if (!this._timeSliderClick && this._containsClass(this._mediaDiv, "e-media-mouse")) {
                left = parseFloat(head.style.marginLeft) + parseFloat(head.style.width) / 2;
                top = "100%";
                if (this.model.renderMode == ej.MediaPlayer.RenderMode.Basic)
                    top = "150%";
                this._animate(head, { "width": "0px", "height": "0px", "top": top, "margin-left": left + "px" }, 100, function () {
                    ins._addClass(head, "e-hide");
                });
            }
        };
        ejMediaPlayer.prototype._timeSliderTouchMove = function (evt) {
            var time = this._getTouchTime(evt), sliderIns;
            sliderIns = this._getEJControlInstance(evt.target.querySelector(".e-media-timeslider"), "Slider");
            if (sliderIns && time) {
                this._addClass(evt.target.querySelector(".e-handle"), "e-media-slider-size");
                sliderIns.option("value", time);
            }
        };
        ejMediaPlayer.prototype._getTouchTime = function (evt) {
            var duration, slider, clientX, time;
            duration = this._getMediaDuration(this._getCurrentMedia());
            slider = this._closest(evt.target, ".e-media-timeslider") || evt.target.querySelector(".e-media-timeslider");
            if (slider) {
                clientX = evt.touches && evt.touches.length > 0 ? evt.touches[0].clientX : evt.clientX;
                time = ((clientX - slider.getBoundingClientRect().left) / slider.getBoundingClientRect().width) * parseInt(duration);
                if (time > duration)
                    time = duration;
                return time;
            }
        };
        ejMediaPlayer.prototype._timeSliderMouseDown = function (evt) {
            var sliderHandle, mediaEle, isYoutube;
            if (this._mediaDiv.querySelector(".e-media-control-container").style.opacity != "0") {
                this._timeSliderClick = true;
                sliderHandle = this._closest(evt.target, ".e-handle");
                if ((evt.type == "touchstart" || evt.pointerType == "touch") && sliderHandle) {
                    this._addClass(sliderHandle, "e-media-slider-size");
                }
                window.clearInterval(this._playTimer);
                mediaEle = this._getCurrentMedia();
                isYoutube = this._isYoutubeElement(mediaEle);
                if (!isYoutube && !mediaEle.paused) {
                    this._pausedManual = true;
                    this._pauseMedia(mediaEle);
                }
                else if (isYoutube && this._processYoutubeAPI("getPlayerState", null) == "1") {
                    this._pausedManual = true;
                    this._processYoutubeAPI("pauseVideo", null);
                }
            }
        };
        ejMediaPlayer.prototype._getHoverTime = function (evt) {
            var duration = this._getMediaDuration(this._getCurrentMedia()), slider, time;
            slider = this._closest(evt.target, ".e-media-timeslider") || evt.target.querySelector(".e-media-timeslider");
            if (slider) {
                time = ((evt.clientX - slider.getBoundingClientRect().left) / slider.getBoundingClientRect().width) * parseInt(duration);
                if (time > duration)
                    time = duration;
                return time;
            }
        };
        ejMediaPlayer.prototype._renderToolbarControls = function (toolbar) {
            this._renderPlayerGroup(toolbar);
            this._renderSettingsGroup(toolbar);
        };
        ejMediaPlayer.prototype._renderSettingsGroup = function (toolbar) {
            var mediaId = this._id, settingsGroup, settingsIcon, fullscreenIcon;
            settingsGroup = this._createElement("ul", mediaId + "_settingsGroup", "e-media-toolbar-ul e-media-toolbar-settingsgroup", false);
            settingsIcon = this._createElement("li", mediaId + "_settingsIcon", "e-media-toolbar-icon e-media-settings e-icon e-media-lp-set-icon", false);
            fullscreenIcon = this._createElement("li", mediaId + "_fullscreenIcon", "e-media-toolbar-icon e-media-fullscreen e-icon", false);
            settingsGroup.appendChild(settingsIcon);
            settingsGroup.appendChild(fullscreenIcon);
            toolbar.appendChild(settingsGroup);
        };
        ejMediaPlayer.prototype._renderPlayerGroup = function (toolbar) {
            var mediaId = this._id, playGroup, playIcon, backwardIcon, previousIcon, forwardIcon, forwardIcon, nextIcon, playlistIcon, repeatIcon, shuffleIcon, volumeIcon, volumeSliderLiItem, volumeSliderIcon, split1, split2;
            playGroup = this._createElement("ul", mediaId + "_playGroup", "e-media-toolbar-ul e-media-toolbar-playgroup", false);
            playIcon = this._createElement("li", mediaId + "_playIcon", "e-media-toolbar-icon e-media-play e-icon", false);
            backwardIcon = this._createElement("li", mediaId + "_backwardIcon", "e-media-toolbar-icon e-media-backward e-icon e-media-lp-icons", false);
            forwardIcon = this._createElement("li", mediaId + "_forwardIcon", "e-media-toolbar-icon e-media-forward e-icon e-media-lp-icons", false);
            previousIcon = this._createElement("li", mediaId + "_previousIcon", "e-media-toolbar-icon e-media-previous e-icon", false);
            nextIcon = this._createElement("li", mediaId + "_nextIcon", "e-media-toolbar-icon e-media-next e-icon", false);
            playlistIcon = this._createElement("li", mediaId + "_playlistIcon", "e-media-toolbar-icon e-media-playlist e-icon", false);
            repeatIcon = this._createElement("li", mediaId + "_repeatIcon", "e-media-toolbar-icon e-media-repeat e-icon e-media-lp-icons", false);
            if (this.model.repeat)
                this._addClass(repeatIcon, "media-repeated");
            shuffleIcon = this._createElement("li", mediaId + "_shuffleIcon", "e-media-toolbar-icon e-media-shuffle e-icon e-media-lp-icons", false);
            if (this.model.shuffle)
                this._addClass(shuffleIcon, "media-shuffled");
            volumeIcon = this._createElement("li", mediaId + "_volumeIcon", "e-media-toolbar-icon e-media-volume e-icon", false);
            volumeSliderLiItem = this._createElement("li", mediaId + "_volumeSliderLi", "e-media-toolbar-icon e-media-volume-slider-li e-media-lp-icons", false);
            volumeSliderIcon = this._createElement("div", mediaId + "_volumeSliderIcon", "e-media-volume-slider", false);
            volumeSliderLiItem.appendChild(volumeSliderIcon);
            playGroup.appendChild(playIcon);
            split1 = this._createElement("li", mediaId + "_splitIcon1", "e-media-toolbar-split", false);
            playGroup.appendChild(split1);
            playGroup.appendChild(previousIcon);
            playGroup.appendChild(backwardIcon);
            playGroup.appendChild(forwardIcon);
            playGroup.appendChild(nextIcon);
            split2 = this._createElement("li", mediaId + "_splitIcon2", "e-media-toolbar-split", false);
            playGroup.appendChild(split2);
            playGroup.appendChild(playlistIcon);
            playGroup.appendChild(repeatIcon);
            playGroup.appendChild(shuffleIcon);
            playGroup.appendChild(volumeIcon);
            playGroup.appendChild(volumeSliderLiItem);
            toolbar.appendChild(playGroup);
        };
        ejMediaPlayer.prototype._renderMobileToolbar = function (controlContainer) {
            var mediaId = this._id, ins = this, toolbar, playUlItem, previousIcon, nextIcon, basicUlItem, timeStartTextLiItem, timeStampRun, timeLiItem, timeSlider, timeTextLiItem, timeStamp, fullscreenLiItem, fullscreenIcon;
            toolbar = this._createElement("div", mediaId + "_mplayerToolbar", "e-media-toolbar mob", false);
            controlContainer.appendChild(toolbar);
            playUlItem = this._createElement("ul", mediaId + "_mobPlayUl", "e-media-toolbar-ul mob-playGroup", false);
            previousIcon = this._createElement("li", mediaId + "_mpreviousIcon", "e-media-toolbar-icon e-media-previous e-icon", false);
            previousIcon.title = this._getLocaleString("Previous");
            nextIcon = this._createElement("li", mediaId + "_mnextIcon", "e-media-toolbar-icon e-media-next e-icon", false);
            nextIcon.title = this._getLocaleString("Next");
            playUlItem.appendChild(previousIcon);
            playUlItem.appendChild(nextIcon);
            this._mediaDiv.querySelector(".e-media-content-div").appendChild(playUlItem);
            playUlItem.addEventListener("click", function (evt) {
                ins._preventDefault(evt);
                ins._mediaToolBarClick(evt, false);
            });
            playUlItem.addEventListener("touchend", function (evt) {
                if (!ins._closest(evt.target, ".e-slider-wrap"))
                    ins._preventDefault(evt);
                ins._mediaToolBarClick(evt, false);
            });
            basicUlItem = this._createElement("ul", mediaId + "_mobUl", "e-media-toolbar-ul toolGroup", false);
            timeStartTextLiItem = this._createElement("li", mediaId + "_mtimeStartTextLi", "e-media-toolbar-li e-media-toolbar-time-run-li", false);
            timeStampRun = this._createElement("div", mediaId + "_mtimeStamp", "e-media-time-stamp-run e-media-mob", false);
            timeStartTextLiItem.appendChild(timeStampRun);
            timeLiItem = this._createElement("li", mediaId + "_mtimeLi", "e-media-toolbar-li e-media-time-li", false);
            timeSlider = this._createElement("div", mediaId + "_mtimeSlider", "e-media-timeslider e-media-mob", false);
            timeLiItem.appendChild(timeSlider);
            timeTextLiItem = this._createElement("li", mediaId + "_mtimeTextLi", "e-media-toolbar-li e-media-toolbar-time-icon-li", false);
            timeStamp = this._createElement("div", mediaId + "_mtimeStamp", "e-media-time-stamp-end e-media-mob", false);
            timeTextLiItem.appendChild(timeStamp);
            fullscreenLiItem = this._createElement("li", mediaId + "_mfullscreenLi", "e-media-toolbar-li e-media-toolbar-fullscreen-li", false);
            fullscreenIcon = this._createElement("div", mediaId + "_mfullscreenIcon", "e-media-toolbar-icon e-media-fullscreen e-icon", false);
            fullscreenLiItem.appendChild(fullscreenIcon);
            basicUlItem.appendChild(timeStartTextLiItem);
            basicUlItem.appendChild(timeLiItem);
            basicUlItem.appendChild(timeTextLiItem);
            basicUlItem.appendChild(fullscreenLiItem);
            toolbar.appendChild(basicUlItem);
            toolbar.addEventListener("click", function (evt) {
                if (!ins._closest(evt.target, ".e-slider-wrap"))
                    ins._preventDefault(evt);
                ins._mediaToolBarClick(evt, false);
            });
            toolbar.addEventListener("touchend", function (evt) {
                if (ins._allowTouchEvent(evt)) {
                    if (!ins._closest(evt.target, ".e-slider-wrap"))
                        ins._preventDefault(evt);
                    ins._mediaToolBarClick(evt, false);
                }
            });
            this._renderTimeSlider(this._mediaDiv.querySelector(".e-media-timeslider"));
        };
        ejMediaPlayer.prototype._renderSettingspopup = function () {
            var mediaId = this._id, settingsDiv, settingsData, settingsPopup;
            settingsDiv = this._createElement("div", mediaId + "_settingsPopup", "e-media-settings-popup e-hide", false);
            settingsData = '<ul>'
                + '<li data-ej-text="Speed" class="e-media-settings-speed">'
                + '<ul class="e-media-settings-speed-ul"><li data-ej-text="0.25"></li>'
                + '<li data-ej-text="0.5"></li>'
                + '<li data-ej-text="0.75"></li>'
                + '<li data-ej-text="Normal"></li>'
                + '<li data-ej-text="1.25"></li>'
                + '<li data-ej-text="1.5"></li>'
                + '<li data-ej-text="1.75"></li>'
                + '<li data-ej-text="2"></li>'
                + '</ul></li>'
                + '<li data-ej-text="Quality" class="e-media-settings-quality">'
                + '<ul class="e-media-settings-quality-ul"><li data-ej-text="1080p"></li>'
                + '<li data-ej-text="720p"></li>'
                + '<li data-ej-text="480p"></li>'
                + '<li data-ej-text="360p"></li>'
                + '<li data-ej-text="240p"></li>'
                + '<li data-ej-text="Auto"></li>'
                + '</ul></li>'
                + '</ul>';
            settingsDiv.innerHTML = settingsData;
            this._mediaDiv.appendChild(settingsDiv);
            settingsPopup = this._mediaDiv.querySelector(".e-media-settings-popup");
            this._renderSettingsListView(settingsPopup);
            this._addQualityHDTag(settingsPopup);
            this._addSettingsOverlay(settingsPopup);
        };
        ejMediaPlayer.prototype._addSettingsOverlay = function (settingsPopup) {
            var settingsOverlay, speedEle;
            settingsOverlay = this._createElement("div", this._id + "_settingsOverlay", "e-media-settings-overlay e-hide", false);
            speedEle = this._getSettingsGroupByType("speed");
            if (speedEle)
                speedEle.appendChild(settingsOverlay);
        };
        ejMediaPlayer.prototype._addQualityHDTag = function (settingsPopup) {
            var qualityDivId, qualityDiv, hdTag1, li1, hdTag2, li2;
            qualityDivId = settingsPopup.querySelector(".e-media-settings-quality").getAttribute("data-childid");
            qualityDiv = settingsPopup.querySelector("#" + qualityDivId);
            if (qualityDiv) {
                hdTag1 = this._createElement("span", null, "e-media-hd-tag");
                hdTag1.innerHTML = "HD";
                li1 = qualityDiv.querySelectorAll("li")[0];
                li1.appendChild(hdTag1);
                hdTag2 = this._createElement("span", null, "e-media-hd-tag");
                hdTag2.innerHTML = "HD";
                li2 = qualityDiv.querySelectorAll("li")[1];
                li2.appendChild(hdTag2);
            }
        };
        ejMediaPlayer.prototype._renderSubtitleButton = function () {
            var ins = this;
            this._renderEJControls(this._mediaDiv.querySelector(".e-media-settings-subtitle-btn"), "Slider", {
                width: "25px",
                sliderType: ej.SliderType.MinRange,
                animationSpeed: 100,
                value: 1,
                minValue: 0,
                maxValue: 1,
                showRoundedCorner: true,
                showTooltip: false,
                incrementStep: 1,
                change: function (args) {
                    ins._handleSubtitleBtnClick(args);
                }
            });
        };
        ejMediaPlayer.prototype._renderSettingsListView = function (settingsPopup) {
            var ins = this;
            this._renderEJControls(settingsPopup, "ListView", {
                showHeader: true, showHeaderBackButton: true, headerTitle: "Settings", width: 150, mouseDown: function (evt) {
                    ins._onSettingsPopupMouseDown(evt, this);
                    ins._onSettingsPopupClick();
                },
                mouseUp: function (evt) {
                    ins._onSettingsPopupMouseUp();
                }
            });
        };
        ejMediaPlayer.prototype._onSettingsPopupClick = function () {
            this._setPopupPosition(this._mediaDiv.querySelector(".e-media-settings-popup"));
        };
        ejMediaPlayer.prototype._onSettingsPopupMouseUp = function () {
            if (this._isSettingsClick) {
                var ins = this;
                setTimeout(function () {
                    ins._hideSettingsPopup(null);
                    ins._isSettingsClick = false;
                });
            }
        };
        ejMediaPlayer.prototype._onSettingsPopupMouseDown = function (args, settingsPopup) {
            var itemCollection = args.item, item, groupEle, headerText, isYoutube, textEle, mediaEle, textValue, speed, ins = this;
            if (itemCollection && itemCollection.length) {
                item = itemCollection[0];
                groupEle = this._closest(item, ".subpage");
                textEle = this._closest(item, ".e-list-text") || item.querySelector(".e-list-text");
                if (groupEle && textEle && !this._containsClass(item, "disabled")) {
                    headerText = this._getSettingsHeaderText(groupEle, settingsPopup);
                    mediaEle = this._getCurrentMedia(), isYoutube = this._isYoutubeElement(mediaEle);
                    textValue = textEle.innerText;
                    if (this._containsClass(groupEle, "e-childitem")) {
                        if (headerText.toLowerCase() == "speed") {
                            speed = textValue == ej.MediaPlayer.SpeedText.Normal ? 1 : parseFloat(textValue);
                            this._onActionBegin({ mediaInfo: this._getCurrentMediaInfo(), speed: this.model.playSpeed, actionType: "speedChange" });
                            this._setPlayerSpeed(mediaEle, speed, isYoutube);
                            this._isSettingsClick = true;
                            this._onActionComplete({ mediaInfo: this._getCurrentMediaInfo(), speed: this.model.playSpeed, actionType: "speedChange" });
                        }
                        else if (headerText.toLowerCase() == "quality") {
                            this._onActionBegin({ mediaInfo: this._getCurrentMediaInfo(), quality: this._getPlayerQuality(mediaEle), actionType: "qualityChange" });
                            this._setMediaQuality(mediaEle, textValue, isYoutube);
                            this._isSettingsClick = true;
                            this._onActionComplete({ mediaInfo: this._getCurrentMediaInfo(), quality: this._getPlayerQuality(mediaEle), actionType: "qualityChange" });
                        }
                    }
                    else {
                        headerText = textValue;
                        groupEle = this._getSettingsGroupByType(headerText);
                        setTimeout(function () {
                            groupEle.querySelector(".e-btn-text").innerText = headerText;
                        }, 200);
                    }
                }
            }
        };
        ejMediaPlayer.prototype._getSettingsHeaderText = function (groupEle, settingsPopup) {
            var headerText = "Settings";
            if (groupEle.innerHTML.indexOf(ej.MediaPlayer.SpeedText.Normal) != -1)
                headerText = "Speed";
            else if (groupEle.innerHTML.indexOf(ej.MediaPlayer.QualityText.Auto) != -1)
                headerText = "Quality";
            return headerText;
        };
        ejMediaPlayer.prototype._expandToolbar = function (evt) {
            var videoTitleEle;
            this._fadeIn(this._mediaDiv.querySelector(".e-media-control-container"));
            videoTitleEle = this._mediaDiv.querySelector(".e-media-video-baner");
            if (this.model.showPlaylist && this.model.renderMode !== "mobile")
                this._fadeIn(this._mediaDiv.querySelector(".e-media-playlist-toggle"));
            if (this._getCurrentMedia() instanceof HTMLAudioElement == false && this.model.showTitle) {
                this._removeClass(videoTitleEle, "e-hide");
                this._fadeIn(videoTitleEle);
            }
            else
                this._addClass(videoTitleEle, "e-hide");
            this._collapseToolbar(evt);
        };
        ejMediaPlayer.prototype._collapseToolbar = function (evt) {
            var ins = this, hideTime;
            hideTime = parseInt(this.model.autoHideTime.toString()) * 1000;
            window.clearTimeout(this._autoHideTime);
            if (!evt || !ins._closest(evt.target, ".e-media-control-container") || (evt && evt.touches)) {
                ins._autoHideTime = setTimeout(function () {
                    ins._fadeOut(ins._mediaDiv.querySelector(".e-media-control-container"));
                    ins._fadeOut(ins._mediaDiv.querySelector(".e-media-video-baner"));
                    if (ins.model.showPlaylist && ins.model.renderMode !== "mobile")
                        ins._fadeOut(ins._mediaDiv.querySelector(".e-media-playlist-toggle"));
                }, hideTime);
            }
        };
        ejMediaPlayer.prototype._renderPlaylist = function () {
            var mediaId = this._id, viewClass, playlistContainer, playlistHeader, playlistTitle, playlistNav, closeIcon, playlistLabel, playlistPrevious, playlistNext, playlistDiv, toggleIcon, mediaDiv, ins = this, playlist, mediaBounds, height, listBoxIns;
            viewClass = this.model.renderMode == ej.MediaPlayer.RenderMode.Mobile ? "mobile" : "desktop";
            playlistContainer = this._createElement("div", mediaId + "_playlistContainer", "e-media-playlist-container " + viewClass + " e-hide", false);
            playlistHeader = this._createElement("div", mediaId + "_playlistHeader", "e-media-playlist-header", false);
            playlistTitle = this._createElement("div", mediaId + "_playlistTitle", "e-media-playlist-title", false);
            playlistNav = this._createElement("div", mediaId + "_playlistNav", "e-media-playlist-navigation", false);
            closeIcon = this._createElement("div", mediaId + "_playlistClose", "e-media-playlist-close e-icon", false);
            closeIcon.title = this._getLocaleString("HidePlaylist");
            playlistHeader.appendChild(playlistTitle);
            if (this.model.renderMode != ej.MediaPlayer.RenderMode.Mobile)
                playlistHeader.appendChild(closeIcon);
            playlistHeader.appendChild(playlistNav);
            playlistLabel = this._createElement("label", mediaId + "_playlistLabel", "e-media-playlist-header-label", false);
            playlistPrevious = this._createElement("span", mediaId + "_playlistPrevious", "e-media-playlist-icon e-media-playlist-header-previous e-icon", false);
            playlistPrevious.title = this._getLocaleString("Previous");
            playlistNext = this._createElement("span", mediaId + "_playlistNext", "e-media-playlist-icon e-media-playlist-header-next e-icon", false);
            playlistNext.title = this._getLocaleString("Next");
            playlistNav.appendChild(playlistLabel);
            playlistContainer.appendChild(playlistHeader);
            playlistDiv = this._createElement("div", mediaId + "_playlist", "e-media-playlist-div", false);
            playlistContainer.appendChild(playlistDiv);
            toggleIcon = this._createElement("div", mediaId + "_playlist_toggle", "e-media-playlist-toggle " + viewClass + " e-media-collapse e-icon e-hide", false);
            toggleIcon.title = this._getLocaleString("TogglePlaylist");
            mediaDiv = this._mediaDiv;
            mediaDiv.appendChild(toggleIcon);
            mediaDiv.appendChild(playlistContainer);
            playlist = this._playlist, mediaDiv = this._mediaDiv;
            mediaBounds = mediaDiv.getBoundingClientRect();
            height = this.model.renderMode == ej.MediaPlayer.RenderMode.Mobile ? this._playlist.length * 52 : parseInt(mediaBounds.height.toString()) - 45;
            this._renderEJControls(mediaDiv.querySelector(".e-media-playlist-div"), "ListBox", {
                dataSource: ins._dataSource, width: "100%",
                itemHeight: "52px",
                height: height,
                select: function (args) {
                    ins._playlistItemClick(args);
                },
                create: function (args) {
                    ins._updateListBoxScroller();
                },
                template: '<div class="e-media-playlist-item" title="${title}"><label class="e-media-playlist-number">${number}</label><div class="e-media-playlist-img-div ' + viewClass + '"><div class="e-media-playlist-img" style="background-image:url(${posterUrl})"></div><div class="e-media-playlist-play e-icon"></div></div>' +
                    '<div class="e-media-playlist-title-div ' + viewClass + '"><div class="e-media-playlist-name"> ${title} </div><div class="e-media-playlist-author">${author}</div></div>'
            });
            if (playlist.length > 0) {
                this._setPlaylistHeaderText("1/" + playlist.length);
                listBoxIns = this._getEJControlInstance(this._mediaDiv.querySelector(".e-media-playlist-div"), "ListBox");
                listBoxIns.selectItemByIndex(0);
            }
            mediaDiv.querySelector(".e-media-playlist-toggle").addEventListener('click', function (evt) {
                ins._togglePlaylist();
            });
            if (this.model.renderMode != ej.MediaPlayer.RenderMode.Mobile) {
                mediaDiv.querySelector(".e-media-playlist-close").addEventListener('click', function (evt) {
                    ins._hidePlaylist();
                    ins._removeClass(ins._mediaDiv.querySelector('.e-media-playlist-toggle'), "e-hide");
                    ins._mediaDiv.querySelector(".e-media-playlist-container").style.display = 'none';
                });
            }
            mediaDiv.querySelector(".e-media-playlist-title").innerText = this.model.playlistTitle;
            playlistContainer.addEventListener("click", function (evt) {
                ins.focus();
            });
            playlistContainer.addEventListener("touchend", function (evt) {
                ins.focus();
            });
        };
        ejMediaPlayer.prototype._updateListBoxScroller = function () {
            var ins = this, listboxObj;
            setTimeout(function () {
                listboxObj = ins._getEJControlInstance(ins._mediaDiv.querySelector(".e-media-playlist-div"), "ListBox");
                listboxObj._refreshScroller();
            }, 500);
        };
        ejMediaPlayer.prototype._generatePlayerData = function () {
            this._addPlaylistItemsAjax([], 0, this._playlist.length);
        };
        ejMediaPlayer.prototype._addYoutubePlaylistData = function (data, listItem, index) {
            var snippet;
            if (data && data.items && data.items[0] && data.items[0].snippet) {
                snippet = data.items[0].snippet;
                listItem.author = snippet.channelTitle;
                listItem.title = snippet.title;
                if (snippet.thumbnails && snippet.thumbnails["default"])
                    listItem.posterUrl = snippet.thumbnails["default"].url;
                listItem.number = index + 1;
            }
        };
        ejMediaPlayer.prototype._addDefaultPlaylistValue = function (listItem, index) {
            if (!listItem.title)
                listItem.title = this._getLocaleString("Media");
            +" " + (index + 1);
            if (!listItem.posterUrl)
                listItem.posterUrl = "";
            if (!listItem.author)
                listItem.author = "";
            listItem.number = index + 1;
        };
        ejMediaPlayer.prototype._addNextPlaylistItem = function (dataSource, listItem, index) {
            dataSource.push(listItem);
            index = index + 1;
            if (index == length)
                this._generatePlaylistData(dataSource);
            else
                this._addPlaylistItemsAjax(dataSource, index, length);
        };
        ejMediaPlayer.prototype._togglePlaylist = function () {
            if (this._containsClass(this._mediaDiv.querySelector(".e-media-playlist-toggle"), "e-media-expand"))
                this._collapsePlaylist();
            else
                this._expandPlaylist();
        };
        ejMediaPlayer.prototype._expandPlaylist = function () {
            if (this.model.contentType != ej.MediaPlayer.ContentType.Audio) {
                var playlistDiv, toggleIcon, videoBaner, mediaEleDiv, controlDiv, ins = this;
                playlistDiv = this._mediaDiv.querySelector(".e-media-playlist-container");
                toggleIcon = this._mediaDiv.querySelector(".e-media-playlist-toggle");
                this._addClass(toggleIcon, "e-media-expand");
                this._removeClass(toggleIcon, "e-media-collapse");
                if (this._containsClass(playlistDiv, "desktop")) {
                    videoBaner = this._mediaDiv.querySelector(".e-media-video-baner");
                    mediaEleDiv = this._mediaDiv.querySelector(".e-media-content-div");
                    controlDiv = this._mediaDiv.querySelector(".e-media-control-container");
                    ins._hideWaitingPopup();
                    this._animate(playlistDiv, { "width": ins._playlistWidth }, null, function () {
                        ins._removeClass(playlistDiv.querySelector(".e-media-playlist-header"), "e-hide");
                        ins._removeClass(playlistDiv.querySelector(".e-ddl-popup"), "e-hide");
                        ins._setLowPriorityIconsVisibility();
                        playlistDiv.style.display = "block";
                        ins._showWaitingPopup();
                    });
                    this._animate(mediaEleDiv, { "width": 100 - parseFloat(ins._playlistWidth.toString()) + "%" }, null, null);
                    this._animate(controlDiv, { "width": 100 - parseFloat(ins._playlistWidth.toString()) + "%" }, null, null);
                    this._animate(toggleIcon, { "right": ins._playlistWidth }, null, null);
                    if (videoBaner)
                        this._animate(videoBaner, { "width": 100 - parseFloat(ins._playlistWidth.toString()) + "%" }, null, null);
                    this._updateListBoxScroller();
                }
                else
                    this._animate(playlistDiv.querySelector(".e-ddl-popup"), { "height": playlistDiv.querySelector(".e-listbox-container").getBoundingClientRect().height }, null, null);
            }
        };
        ejMediaPlayer.prototype._collapsePlaylist = function () {
            if (this.model.contentType != ej.MediaPlayer.ContentType.Audio) {
                var playlistDiv, toggleIcon, videoBaner, mediaEleDiv, controlDiv, ins = this;
                playlistDiv = this._mediaDiv.querySelector(".e-media-playlist-container");
                toggleIcon = this._mediaDiv.querySelector(".e-media-playlist-toggle");
                this._removeClass(toggleIcon, "e-media-expand");
                this._addClass(toggleIcon, "e-media-collapse");
                if (this._containsClass(playlistDiv, "desktop")) {
                    videoBaner = this._mediaDiv.querySelector(".e-media-video-baner");
                    mediaEleDiv = this._mediaDiv.querySelector(".e-media-content-div");
                    controlDiv = this._mediaDiv.querySelector(".e-media-control-container");
                    ins._addClass(playlistDiv.querySelector(".e-media-playlist-header"), "e-hide");
                    ins._addClass(playlistDiv.querySelector(".e-ddl-popup"), "e-hide");
                    ins._hideWaitingPopup();
                    this._animate(playlistDiv, { "width": "0%" }, null, function () {
                        ins._removeClass(playlistDiv.querySelector(".e-media-playlist-header"), "e-hide");
                        ins._removeClass(playlistDiv.querySelector(".e-ddl-popup"), "e-hide");
                        ins._setLowPriorityIconsVisibility();
                        ins._showWaitingPopup();
                    });
                    this._animate(mediaEleDiv, { "width": "100%" }, null, null);
                    this._animate(controlDiv, { "width": "100%" }, null, null);
                    this._animate(toggleIcon, { "right": "0%" }, null, null);
                    if (videoBaner)
                        this._animate(videoBaner, { "width": "100%" }, null, null);
                    this._updateListBoxScroller();
                }
                else
                    this._animate(playlistDiv.querySelector(".e-ddl-popup"), { "height": "0px" }, null, null);
            }
        };
        ejMediaPlayer.prototype._playlistItemClick = function (args) {
            var index = args.index, mediaElement, prevItem, nextItem;
            mediaElement = this._getCurrentMedia();
            if (index != this._mediaIndex) {
                prevItem = this._mediaDiv.querySelector(".e-media-playlist-header-previous");
                nextItem = this._mediaDiv.querySelector(".e-media-playlist-header-next");
                if (index == 0)
                    this._addClass(prevItem, "disabled");
                else
                    this._removeClass(prevItem, "disabled");
                if (index == this._playlist.length - 1)
                    this._addClass(nextItem, "disabled");
                else
                    this._removeClass(nextItem, "disabled");
                this._playVideoByIndex(mediaElement, index, true);
                this._setPlaylistHeaderText(index + 1 + "/" + this._playlist.length);
            }
            else if (mediaElement) {
                this._seekVideo(mediaElement, 0, this._isYoutubeElement(mediaElement));
                this._updateTimeSlider(mediaElement, null);
                this._updateTimeStamp(mediaElement);
            }
        };
        ejMediaPlayer.prototype._setPlaylistHeaderText = function (value) {
            this._mediaDiv.querySelector(".e-media-playlist-header-label").innerText = value;
        };
        ejMediaPlayer.prototype._selectPlaylistItemByType = function (type) {
            var listBoxIns, selIndex, newItemIndex;
            listBoxIns = this._getEJControlInstance(this._mediaDiv.querySelector(".e-media-playlist-div"), "ListBox");
            selIndex = listBoxIns.model.selectedIndex || 0;
            newItemIndex = type == "previous" ? selIndex - 1 : selIndex + 1;
            if (newItemIndex >= 0 && newItemIndex < this._playlist.length)
                listBoxIns.selectItemByIndex(newItemIndex);
        };
        ejMediaPlayer.prototype._setPlaylistVisibility = function () {
            if (this._containsClass(this._mediaDiv.querySelector(".e-media-playlist-container"), "e-hide"))
                this._showPlaylist();
            else
                this._hidePlaylist();
        };
        ejMediaPlayer.prototype._showPlaylist = function () {
            this._trigger("onTogglePlaylist", { mediaInfo: this._getCurrentMediaInfo(), visible: false });
            this._removeClass(this._mediaDiv.querySelector(".e-media-playlist-container"), "e-hide");
            this._addClass(this._mediaDiv.querySelector(".e-media-playlist"), "e-media-playlist-visible");
            if (this.model.renderMode == ej.MediaPlayer.RenderMode.Mobile)
                this._removeClass(this._mediaDiv.querySelector(".e-media-playlist-toggle"), "e-hide");
            this._expandPlaylist();
        };
        ejMediaPlayer.prototype._hidePlaylist = function () {
            this._trigger("onTogglePlaylist", { mediaInfo: this._getCurrentMediaInfo(), visible: true });
            this._collapsePlaylist();
            this._addClass(this._mediaDiv.querySelector(".e-media-playlist-container"), "e-hide");
            this._removeClass(this._mediaDiv.querySelector(".e-media-playlist"), "e-media-playlist-visible");
            if (this.model.renderMode == ej.MediaPlayer.RenderMode.Mobile)
                this._addClass(this._mediaDiv.querySelector(".e-media-playlist-toggle"), "e-hide");
        };
        ejMediaPlayer.prototype._setAllMediaProperties = function () {
            var mediaElements = this._mediaDiv.querySelector(".e-media-content-div").children, isYoutube, mediaElement;
            for (var i = 0; i < mediaElements.length; i++) {
                mediaElement = mediaElements[i];
                if (this._containsClass(mediaElement, "e-media-element")) {
                    isYoutube = this._isYoutubeElement(mediaElement);
                    if (isYoutube) {
                        this._changeMediaSource(mediaElement);
                        this._renderYTPlayer(mediaElement.id);
                    }
                    else {
                        this._setMediaSettings(mediaElement, isYoutube);
                        this._changeMediaSource(mediaElement);
                    }
                }
            }
            this._updateAutoPlay();
        };
        ejMediaPlayer.prototype._setMediaSettings = function (mediaEle, isYoutube) {
            if (mediaEle) {
                var model = this.model;
                this._setPlayerSpeed(mediaEle, model.playSpeed, isYoutube);
                this._repeat = model.repeat;
                this._mute = model.mute;
                this._shuffle = model.shuffle;
                this._setMute(mediaEle, model.mute, isYoutube);
                this._setVolume(mediaEle, model.volume, isYoutube);
            }
        };
        ejMediaPlayer.prototype._setMediaSource = function (mediaElement, url, isYoutube, isFirstLoad) {
            if (isYoutube) {
                if (!isFirstLoad || this.model.autoPlay) {
                    var loadObj = {
                        mediaContentUrl: "https://www.youtube.com/v/" + this._getYTVideoIdFromUrl(url) + "?version=3",
                        startSeconds: 1
                    };
                    this._processYoutubeAPI("loadVideoByUrl", loadObj);
                }
            }
            else
                mediaElement.setAttribute("src", url);
        };
        ejMediaPlayer.prototype._setSubtitle = function (mediaElement, trackUrl, isYoutube) {
            if (isYoutube)
                this._setYoutubeSubtitle();
            else if (mediaElement instanceof HTMLVideoElement)
                this._setVideoSubtitle(mediaElement, trackUrl);
        };
        ejMediaPlayer.prototype._setYoutubeSubtitle = function () {
            if (this._subtitle) {
                this._processYoutubeAPI("loadModule", "captions");
                this._processYoutubeAPI("loadModule", "cc");
            }
            else {
                this._processYoutubeAPI("unloadModule", "captions");
                this._processYoutubeAPI("unloadModule", "cc");
            }
        };
        ejMediaPlayer.prototype._setVideoSubtitle = function (mediaElement, trackUrl) {
            if (this._subtitle) {
                var trackEle = mediaElement.querySelector("track");
                this._removeClass(trackEle, "e-hide");
                if (trackUrl)
                    trackEle.setAttribute("src", trackUrl);
            }
            else
                this._addClass(mediaElement.querySelector("track"), "e-hide");
        };
        ejMediaPlayer.prototype._setModelWidth = function () {
            this._mediaDiv.style.width = this.model.width;
            this._setToolbarIconSize();
        };
        ejMediaPlayer.prototype._setToolbarIconSize = function () {
            this._addClass(this._mediaDiv, "e-media-large-size");
        };
        ejMediaPlayer.prototype._setModelHeight = function () {
            this._mediaDiv.style.height = this.model.height;
        };
        ejMediaPlayer.prototype._setPlayerSpeed = function (mediaEle, speedValue, isYoutube) {
            var speedText;
            if (isYoutube)
                this._processYoutubeAPI("setPlaybackRate", speedValue);
            else
                mediaEle.playbackRate = speedValue;
            speedText = speedValue == 1 ? ej.MediaPlayer.SpeedText.Normal : speedValue;
            this.model.playSpeed = speedValue;
            this._updateSettingsSelector("Speed", speedText);
        };
        ejMediaPlayer.prototype._updateSettingsSelector = function (type, text) {
            var parentDiv, groupEle, elements, element;
            parentDiv = this._mediaDiv.querySelector(".e-media-settings-popup").children;
            groupEle = this._getSettingsGroupByType(type);
            if (groupEle) {
                this._removeClass(groupEle.querySelector(".e-media-settings-selector"), "e-media-settings-selector");
                elements = groupEle.querySelectorAll('.e-list-text');
                for (var i = 0; i < elements.length; i++) {
                    element = elements[i];
                    if (element.textContent.toLowerCase() == text.toString().toLowerCase()) {
                        this._addClass(element, "e-icon");
                        this._addClass(element, "e-media-settings-selector");
                        break;
                    }
                }
            }
        };
        ejMediaPlayer.prototype._getPlayerSpeed = function (mediaEle, isYoutube) {
            if (isYoutube)
                return this._processYoutubeAPI("getPlaybackRate", null);
            else
                return mediaEle.playbackRate;
        };
        ejMediaPlayer.prototype._getPlayerQuality = function (mediaEle) {
            if (this._isYoutubeElement(mediaEle)) {
                return this._playQuality;
            }
        };
        ejMediaPlayer.prototype._setMediaQuality = function (mediaEle, qualityString, isYoutube) {
            if (isYoutube) {
                var videoData = this._processYoutubeAPI("getVideoData", null), currentTime;
                if (videoData) {
                    currentTime = this._processYoutubeAPI("getCurrentTime", null);
                    this._processYoutubeAPIMultiArgs("loadVideoById", videoData.video_id, currentTime, ej.MediaPlayer.Quality[qualityString]);
                }
                this._updateSettingsSelector("Quality", qualityString);
                this._playQuality = qualityString;
            }
        };
        ejMediaPlayer.prototype._setMute = function (mediaEle, isMute, isYoutube) {
            if (isYoutube) {
                if (isMute)
                    this._processYoutubeAPI("mute", null);
                else
                    this._processYoutubeAPI("unMute", null);
            }
            else
                mediaEle.muted = isMute;
        };
        ejMediaPlayer.prototype._setVolume = function (mediaEle, volume, isYoutube) {
            if (volume >= 0 && volume <= 100) {
                if (isYoutube)
                    this._processYoutubeAPI("setVolume", volume);
                else
                    mediaEle.volume = volume / 100;
                this.model.volume = volume;
            }
        };
        ejMediaPlayer.prototype._getVolume = function (mediaEle, isYoutube) {
            if (isYoutube)
                return this._processYoutubeAPI("getVolume", null);
            else
                return mediaEle.volume * 100;
        };
        ejMediaPlayer.prototype._setModelVolume = function (mediaEle, volume, isYoutube) {
            this._onActionBegin({ mediaInfo: this._getCurrentMediaInfo(), volume: this.model.volume, actionType: "volumeChange" });
            this._setVolume(mediaEle, volume, isYoutube);
            this._onActionComplete({ mediaInfo: this._getCurrentMediaInfo(), volume: this.model.volume, actionType: "volumeChange" });
        };
        ejMediaPlayer.prototype._setModelMute = function (mediaEle, mute, isYoutube) {
            var evtString = mute ? "mute" : "unmute";
            this._onActionBegin({ mediaInfo: this._getCurrentMediaInfo(), actionType: evtString });
            this._setMute(mediaEle, mute, isYoutube);
            this._onActionComplete({ mediaInfo: this._getCurrentMediaInfo(), actionType: evtString });
        };
        ejMediaPlayer.prototype._setModelSpeed = function (mediaEle, speed, isYoutube) {
            this._onActionBegin({ mediaInfo: this._getCurrentMediaInfo(), speed: this.getMediaSpeed(), actionType: "speedChange" });
            this._setPlayerSpeed(mediaEle, speed, isYoutube);
            this._onActionComplete({ mediaInfo: this._getCurrentMediaInfo(), speed: this.getMediaSpeed(), actionType: "speedChange" });
        };
        ejMediaPlayer.prototype._mediaToolBarClick = function (evt, isTouch) {
            var selectedElement, controlContainer, mediaElement;
            this._hideSettingsPopup(evt);
            selectedElement = this._closest(evt.target, '.e-media-toolbar-icon') || evt.target.previousElementSibling;
            controlContainer = this._mediaDiv.querySelector(".e-media-control-container");
            if (selectedElement && !this._containsClass(selectedElement, "disabled") && controlContainer.style.opacity != "0") {
                mediaElement = this._getCurrentMedia();
                if (this._containsClass(selectedElement, "e-media-play") || this._containsClass(selectedElement, "e-media-pause") || this._containsClass(selectedElement, "e-media-center-icon"))
                    this._handlePlayIconClick(mediaElement);
                else if (this._containsClass(selectedElement, "e-media-forward"))
                    this._handleFwdBtnClick(mediaElement);
                else if (this._containsClass(selectedElement, "e-media-backward"))
                    this._handleBwdBtnClick(mediaElement);
                else if (this._containsClass(selectedElement, "e-media-next"))
                    this._handleNextBtnClick(mediaElement);
                else if (this._containsClass(selectedElement, "e-media-previous"))
                    this._handlePreviousBtnClick(mediaElement);
                else if (this._containsClass(selectedElement, "e-media-shuffle"))
                    this._handleShuffleBtnClick(selectedElement);
                else if (this._containsClass(selectedElement, "e-media-repeat"))
                    this._handleRepeatBtnClick(selectedElement);
                else if (this._containsClass(selectedElement, "e-media-volume"))
                    this._handleMuteBtnClick(mediaElement, selectedElement, isTouch);
                else if (this._containsClass(selectedElement, "e-media-stop"))
                    this._handleStopBtnClick(mediaElement);
                else if (this._containsClass(selectedElement, "e-media-fullscreen") || this._containsClass(selectedElement, "e-media-smallscreen"))
                    this._handleScreenBtnClick(this._containsClass(selectedElement, "e-media-smallscreen"));
                else if (this._containsClass(selectedElement, "e-media-settings"))
                    this._showSettingsPopup(evt);
                else if (this._containsClass(selectedElement, "e-media-playlist"))
                    this._setPlaylistVisibility();
                this._mediaDiv.querySelector(".e-media-time-tooltip").innerHTML = this._getToolIconsTooltip(evt.target);
            }
        };
        ejMediaPlayer.prototype._handlePlayIconClick = function (mediaElement) {
            this._handlePlayAnimation();
            if (this._isYoutubeElement(mediaElement))
                this._onClickYoutubePlay();
            else if (mediaElement instanceof HTMLVideoElement || mediaElement instanceof HTMLAudioElement)
                this._onToggleVideoPlay(mediaElement);
        };
        ejMediaPlayer.prototype._handlePlayAnimation = function () {
            var playAnimation, centerIcon, ins = this;
            playAnimation = this._mediaDiv.querySelector(".e-media-play-animation.center");
            centerIcon = this._mediaDiv.querySelector(".e-media-center-icon");
            if (centerIcon.style.display = "none")
                this._fadePlayIcon();
            this._removeClass(playAnimation, "e-hide");
            setTimeout(function () {
                ins._addClass(playAnimation, "e-hide");
            }, 500);
        };
        ejMediaPlayer.prototype._onClickYoutubePlay = function () {
            var state = this._processYoutubeAPI("getPlayerState", null), isPaused;
            isPaused = this._mediaDiv.querySelector(".e-media-center-play");
            if (!isPaused)
                this._pauseYoutubeVideo();
            else
                this._playYoutubeVideo();
        };
        ejMediaPlayer.prototype._playYoutubeVideo = function () {
            var args = { mediaInfo: this._getCurrentMediaInfo(), cancel: false, actionType: "play" };
            if (!this._pausedManual)
                this._onActionBegin(args);
            this._processYoutubeAPI("playVideo", null);
            this._addPauseClass();
            this._setAdvToolbarOverflow();
            if (!this._pausedManual)
                this._onActionComplete(args);
        };
        ejMediaPlayer.prototype._pauseYoutubeVideo = function (isAutoPlay) {
            var args = { mediaInfo: this._getCurrentMediaInfo(), cancel: false, actionType: "pause" }, ins = this;
            if (!isAutoPlay)
                this._onActionBegin(args);
            this._processYoutubeAPI("pauseVideo", null);
            setTimeout(function () {
                ins._addPlayClass();
                ins._setAdvToolbarOverflow();
                if (!isAutoPlay)
                    ins._onActionComplete(args);
            }, 100);
        };
        ejMediaPlayer.prototype._onToggleVideoPlay = function (mediaEle) {
            if (mediaEle.paused)
                this._playMedia(mediaEle);
            else
                this._pauseMedia(mediaEle);
        };
        ejMediaPlayer.prototype._playMedia = function (mediaEle) {
            var args = { mediaInfo: this._getCurrentMediaInfo(), cancel: false, actionType: "play" };
            if (!this._pausedManual)
                this._onActionBegin(args);
            if (!args.cancel) {
                this._play(mediaEle);
                this._addPauseClass();
                this._setAdvToolbarOverflow();
                if (!this._pausedManual)
                    this._onActionComplete(args);
            }
        };
        ejMediaPlayer.prototype._play = function (mediaEle) {
            if (mediaEle) {
                var ins = this;
                ins.promise = mediaEle.play();
                if (ins.promise) {
                    ins.promise.then(function () {
                        ins._playStarted = false;
                    });
                }
                else {
                    setTimeout(function () {
                        ins._playStarted = false;
                    });
                }
                ins._playStarted = true;
            }
        };
        ejMediaPlayer.prototype._pauseMedia = function (mediaEle, isAutoPlay) {
            var args = { mediaInfo: this._getCurrentMediaInfo(), cancel: false, actionType: "pause" };
            if (!isAutoPlay)
                this._onActionBegin(args);
            if (!args.cancel) {
                mediaEle.pause();
                this._addPlayClass();
                this._setAdvToolbarOverflow();
                if (!isAutoPlay)
                    this._onActionComplete(args);
                window.clearInterval(this._playTimer);
            }
        };
        ejMediaPlayer.prototype._setAdvToolbarOverflow = function () {
            var advPlayUl = this._mediaDiv.querySelector(".e-media-toolbar-playgroup");
            if (advPlayUl) {
                advPlayUl.style.opacity = 0.9;
                setTimeout(function () {
                    advPlayUl.style.opacity = 1;
                }, 0);
            }
        };
        ejMediaPlayer.prototype._getCurrentMediaInfo = function () {
            var playlist = this._playlist;
            if (playlist.length > 0)
                return playlist[this._mediaIndex];
        };
        ejMediaPlayer.prototype._seekVideo = function (videoEle, time, isYoutube) {
            var duration = this._getMediaDuration(videoEle);
            if (time < 0)
                time = 0;
            else if (time > duration)
                time = duration;
            if (isYoutube) {
                window.clearInterval(this._playTimer);
                this._processYoutubeAPI("seekTo", time);
            }
            else if (videoEle instanceof HTMLVideoElement || videoEle instanceof HTMLAudioElement) {
                if (!videoEle.paused) {
                    this._pausedManual = true;
                    videoEle.pause();
                    window.clearInterval(this._playTimer);
                    videoEle.currentTime = time - 0.001;
                    this._play(videoEle);
                }
                else {
                    videoEle.currentTime = time;
                    this._updateTimeSlider(videoEle, null);
                    this._updateTimeStamp(videoEle);
                }
            }
            if (!this._playTimer) {
                this._updateTimeSlider(videoEle, null);
            }
            this._updateTimeStamp(videoEle);
        };
        ejMediaPlayer.prototype._handleNextBtnClick = function (mediaElement) {
            this._hidePlayGroup();
            this._playVideoByIndex(mediaElement, this._mediaIndex + 1);
        };
        ejMediaPlayer.prototype._handlePreviousBtnClick = function (mediaElement) {
            this._hidePlayGroup();
            this._playVideoByIndex(mediaElement, this._mediaIndex - 1);
        };
        ejMediaPlayer.prototype._hidePlayGroup = function () {
            var mobPlayGroup, prevBasic, nextBasic;
            mobPlayGroup = this._mediaDiv.querySelector(".e-media-toolbar-ul.mob-playGroup");
            prevBasic = this._mediaDiv.querySelector(".e-media-prev-li.basic");
            nextBasic = this._mediaDiv.querySelector(".e-media-next-li.basic");
            if (mobPlayGroup)
                mobPlayGroup.style.display = "none";
            if (prevBasic)
                prevBasic.style.display = "none";
            if (nextBasic)
                nextBasic.style.display = "none";
        };
        ejMediaPlayer.prototype._handleFwdBtnClick = function (mediaElement) {
            this._forwardMedia(mediaElement, parseFloat(this.model.forwardTime.toString()));
        };
        ejMediaPlayer.prototype._handleBwdBtnClick = function (mediaElement) {
            this._rewindMedia(mediaElement, parseFloat(this.model.rewindTime.toString()));
        };
        ejMediaPlayer.prototype._forwardMedia = function (mediaElement, time) {
            var duration = this._getMediaDuration(mediaElement), sliderIns, forwardTime, maxValue;
            if (!duration)
                duration = this._getEJControlInstance(this._mediaDiv.querySelector(".e-media-timeslider"), "Slider").model.maxValue;
            if (this._getCurrentMediaTime(mediaElement) < duration) {
                this._onActionBegin({ mediaInfo: this._getCurrentMediaInfo(), actionType: "forward" });
                sliderIns = this._getEJControlInstance(this._mediaDiv.querySelector(".e-media-timeslider"), "Slider");
                forwardTime = sliderIns.model.value + parseFloat(time);
                maxValue = sliderIns.model.maxValue;
                if (forwardTime > maxValue)
                    forwardTime = maxValue;
                sliderIns.option("value", forwardTime);
                this._seekVideo(mediaElement, forwardTime, this._isYoutubeElement(mediaElement));
                this._onActionComplete({ mediaInfo: this._getCurrentMediaInfo(), actionType: "forward" });
            }
        };
        ejMediaPlayer.prototype._rewindMedia = function (mediaElement, time) {
            if (this._getCurrentMediaTime(mediaElement) > 0) {
                var sliderIns, rewindTime;
                this._onActionBegin({ mediaInfo: this._getCurrentMediaInfo(), actionType: "rewind" });
                sliderIns = this._getEJControlInstance(this._mediaDiv.querySelector(".e-media-timeslider"), "Slider");
                rewindTime = sliderIns.model.value - parseFloat(time);
                sliderIns.option("value", rewindTime);
                this._seekVideo(mediaElement, rewindTime, this._isYoutubeElement(mediaElement));
                this._onActionComplete({ mediaInfo: this._getCurrentMediaInfo(), actionType: "rewind" });
            }
        };
        ejMediaPlayer.prototype._handleRepeatBtnClick = function (selectedElement) {
            var isRepeat = this._containsClass(selectedElement, "media-repeated");
            this._trigger("onRepeat", { mediaInfo: this._getCurrentMediaInfo(), isRepeat: isRepeat });
            if (isRepeat) {
                this._removeClass(selectedElement, "media-repeated");
                this._repeat = false;
            }
            else {
                this._addClass(selectedElement, "media-repeated");
                this._repeat = true;
            }
            this._disablePrevNextIcons();
        };
        ejMediaPlayer.prototype._handleShuffleBtnClick = function (selectedElement) {
            var isShuffle = this._containsClass(selectedElement, "media-shuffled");
            this._trigger("onShuffle", { mediaInfo: this._getCurrentMediaInfo(), isShuffle: isShuffle });
            if (isShuffle) {
                this._removeClass(selectedElement, "media-shuffled");
                this._shuffle = false;
            }
            else {
                this._addClass(selectedElement, "media-shuffled");
                this._shuffle = true;
            }
            this._disablePrevNextIcons();
        };
        ejMediaPlayer.prototype._handleMuteBtnClick = function (mediaElement, selectedElement, isTouch) {
            if (!isTouch) {
                this._hideBasicVolSlider();
                var volSlider = this._mediaDiv.querySelector(".e-media-volume-slider");
                if (this._containsClass(selectedElement, "media-muted")) {
                    this._onActionBegin({ mediaInfo: this._getCurrentMediaInfo(), actionType: "unmute" });
                    this._removeClass(selectedElement, "media-muted");
                    this._mute = false;
                    this._manualMute = true;
                    this._setMute(mediaElement, this._mute, this._isYoutubeElement(mediaElement));
                    this._getEJControlInstance(volSlider, "Slider").option("value", this._getVolume(mediaElement, this._isYoutubeElement(mediaElement)));
                    this._manualMute = false;
                    this._setAdvToolbarOverflow();
                    this._onActionComplete({ mediaInfo: this._getCurrentMediaInfo(), actionType: "unmute" });
                }
                else {
                    this._onActionBegin({ mediaInfo: this._getCurrentMediaInfo(), actionType: "mute" });
                    this._addClass(selectedElement, "media-muted");
                    this._mute = true;
                    this._manualMute = true;
                    this._setMute(mediaElement, this._mute, this._isYoutubeElement(mediaElement));
                    this._getEJControlInstance(volSlider, "Slider").option("value", 0);
                    this._manualMute = false;
                    this._setAdvToolbarOverflow();
                    this._onActionComplete({ mediaInfo: this._getCurrentMediaInfo(), actionType: "mute" });
                }
            }
        };
        ejMediaPlayer.prototype._handleSubtitleBtnClick = function (args) {
            var mediaEle = this._getCurrentMedia();
            this._subtitle = args.value == 1 ? true : false;
            this._setSubtitle(mediaEle, this._playlist[this._mediaIndex].track, this._isYoutubeElement(mediaEle));
        };
        ejMediaPlayer.prototype._handleStopBtnClick = function (mediaElement) {
            this._onActionBegin({ mediaInfo: this._getCurrentMediaInfo(), actionType: "stop" });
            this._stop(mediaElement);
            this._onActionComplete({ mediaInfo: this._getCurrentMediaInfo(), actionType: "stop" });
        };
        ejMediaPlayer.prototype._stop = function (mediaElement) {
            this._pauseCurrentMedia(mediaElement);
            this._addPlayClass(true);
            if (this._isYoutubeElement(mediaElement))
                this._processYoutubeAPI("stopVideo", null);
            else
                this._seekVideo(mediaElement, 0, this._isYoutubeElement(mediaElement));
            this._updateTimeSlider(mediaElement, "0");
            this._updateTimeStamp(mediaElement);
            this._hideWaitingPopup();
        };
        ejMediaPlayer.prototype._handleScreenBtnClick = function (isInFullScreen) {
            if (isInFullScreen)
                this._exitFullScreen();
            else
                this._setFullScreen();
            this._fullScreenChange(isInFullScreen);
        };
        ejMediaPlayer.prototype._onVolSliderChange = function (value) {
            if (!this._manualMute) {
                var currentMedia = this._getCurrentMedia();
                this._onActionBegin({ mediaInfo: this._getCurrentMediaInfo(), volume: this.model.volume, actionType: "volumeChange" });
                this._setVolume(currentMedia, value, this._isYoutubeElement(currentMedia));
                this._setMuteOnVolChange(value, currentMedia);
                this._onActionComplete({ mediaInfo: this._getCurrentMediaInfo(), volume: this.model.volume, actionType: "volumeChange" });
            }
        };
        ejMediaPlayer.prototype._setMuteOnVolChange = function (value, currentMedia) {
            var volEle = this._mediaDiv.querySelector(".e-media-volume"), isYoutube;
            isYoutube = this._isYoutubeElement(currentMedia);
            if (value <= 0 && !this._mute) {
                this._addClass(volEle, "media-muted");
                this._mute = true;
                this._setMute(currentMedia, this._mute, isYoutube);
            }
            else if (value > 0 && this._mute) {
                this._removeClass(volEle, "media-muted");
                this._mute = false;
                this._setMute(currentMedia, this._mute, isYoutube);
            }
        };
        ejMediaPlayer.prototype._onTimeSliderChange = function (value) {
            var evtText, currentMedia;
            evtText = this._getCurrentMediaTime(this._getCurrentMedia()) > value ? "rewind" : "forward";
            this._onActionBegin({ mediaInfo: this._getCurrentMediaInfo(), actionType: evtText });
            currentMedia = this._getCurrentMedia();
            if (currentMedia instanceof HTMLVideoElement || currentMedia instanceof HTMLAudioElement)
                currentMedia.currentTime = value;
            else
                this._processYoutubeAPI("seekTo", value);
            this._updateTimeStamp(currentMedia);
            this._onActionComplete({ mediaInfo: this._getCurrentMediaInfo(), actionType: evtText });
        };
        ejMediaPlayer.prototype._showSettingsPopup = function (evt) {
            var popup = this._mediaDiv.querySelector(".e-media-settings-popup");
            if (this._containsClass(popup, "e-hide")) {
                this._resetInitialView(popup);
                this._removeClass(popup, "e-hide");
                this._setPopupPosition(popup);
                if (this._isYoutubeElement(this._getCurrentMedia())) {
                    this._setYoutubeSpeedVisibility();
                    this._setYoutubeQualityVisibility();
                }
                else
                    this._setVideoOptionVisibility(popup);
            }
            else
                this._addClass(popup, "e-hide");
        };
        ejMediaPlayer.prototype._setVideoOptionVisibility = function (popup) {
            var disabledOptions = popup.querySelectorAll(".e-list.disabled");
            for (var i = 0; i < disabledOptions.length; i++) {
                this._removeClass(disabledOptions[i], "disabled");
            }
        };
        ejMediaPlayer.prototype._setYoutubeSpeedVisibility = function () {
            var speedList, availableSpeed, value;
            speedList = this._getSettingsGroupByType("speed").querySelectorAll(".e-list");
            availableSpeed = this._processYoutubeAPI("getAvailablePlaybackRates", null);
            for (var i = 0; i < speedList.length; i++) {
                value = speedList[i].querySelector(".e-list-text").innerText;
                if (value == ej.MediaPlayer.SpeedText.Normal)
                    value = "1";
                if (availableSpeed.indexOf(parseFloat(value)) == -1)
                    this._addClass(speedList[i], "disabled");
                else
                    this._removeClass(speedList[i], "disabled");
            }
        };
        ejMediaPlayer.prototype._setYoutubeQualityVisibility = function () {
            var availableQuality, qualityList, value;
            availableQuality = this._processYoutubeAPI("getAvailableQualityLevels", null);
            qualityList = this._getSettingsGroupByType("quality").querySelectorAll(".e-list");
            for (var i = 0; i < qualityList.length; i++) {
                value = qualityList[i].querySelector(".e-list-text").innerText;
                value = ej.MediaPlayer.Quality[value.toLowerCase()];
                if (availableQuality.indexOf(value) == -1)
                    this._addClass(qualityList[i], "disabled");
                else
                    this._removeClass(qualityList[i], "disabled");
            }
        };
        ejMediaPlayer.prototype._updateSettingsHeader = function (evt, settingsPopup) {
            var isYoutube = this._isYoutubeElement(this._getCurrentMedia()), headerText;
            if (!isYoutube) {
                headerText = this._getSettingsHeaderText(settingsPopup.children[1], settingsPopup);
                settingsPopup.children[1].querySelector(".e-btn-text").innerText = headerText;
            }
        };
        ejMediaPlayer.prototype._hideSettingsPopup = function (evt) {
            if (!evt || (!this._closest(evt.target, ".e-media-settings") && !this._closest(evt.target, ".e-media-settings-popup")))
                this._addClass(this._mediaDiv.querySelector(".e-media-settings-popup"), "e-hide");
        };
        ejMediaPlayer.prototype._showWaitingPopup = function () {
            if (this._isWaitingPopup) {
                var mediaElementDiv, ins = this, template, ejWaitingIns;
                mediaElementDiv = this._mediaDiv.querySelector(".e-media-content-div");
                ejWaitingIns = this._getEJControlInstance(mediaElementDiv, "WaitingPopup");
                if (!ejWaitingIns) {
                    template = this._createElement("div", null, "e-media-waiting-template");
                    this._mediaDiv.appendChild(template);
                    template = this._mediaDiv.querySelector(".e-media-waiting-template");
                    this._renderEJControls(mediaElementDiv, "WaitingPopup", {
                        width: "100px",
                        height: "100px",
                        showOnInit: true,
                        appendTo: "#" + mediaElementDiv.id,
                        template: template
                    });
                }
                else {
                    ejWaitingIns.show();
                }
            }
        };
        ejMediaPlayer.prototype._hideWaitingPopup = function () {
            var mediaElementDiv, ejWaitingIns;
            mediaElementDiv = this._mediaDiv.querySelector(".e-media-content-div");
            ejWaitingIns = this._getEJControlInstance(mediaElementDiv, "WaitingPopup");
            if (ejWaitingIns) {
                ejWaitingIns.hide();
            }
        };
        ejMediaPlayer.prototype._resetInitialView = function (popup) {
            var isYoutube, speedEle, qualityEle, overlay, btnText, headerText;
            isYoutube = this._isYoutubeElement(this._getCurrentMedia());
            speedEle = this._getSettingsGroupByType("speed");
            qualityEle = this._getSettingsGroupByType("quality");
            qualityEle.style.display = "none";
            overlay = this._mediaDiv.querySelector(".e-media-settings-overlay");
            btnText = speedEle.querySelector(".e-btn-text");
            if (isYoutube) {
                this._addClass(overlay, "e-hide");
                this._removeClass(btnText, "speed");
                this._removeClass(speedEle.querySelector(".e-hicon"), "e-hide");
                popup.children[0].style.display = "block";
                speedEle.style.display = "none";
            }
            else {
                this._removeClass(overlay, "e-hide");
                this._addClass(btnText, "speed");
                this._addClass(speedEle.querySelector(".e-hicon"), "e-hide");
                popup.children[0].style.display = "none";
                speedEle.style.display = "block";
                this._addClass(speedEle, "e-slideleft");
                headerText = this._getSettingsHeaderText(speedEle, popup);
                speedEle.querySelector(".e-btn-text").innerText = headerText;
            }
        };
        ejMediaPlayer.prototype._getSettingsGroupByType = function (type) {
            var popup, speedEle, qualityEle;
            popup = this._mediaDiv.querySelector(".e-media-settings-popup");
            if (type.toString().toLowerCase() == "speed") {
                speedEle = popup.children[1];
                if (speedEle.innerHTML.indexOf(ej.MediaPlayer.SpeedText.Normal) == -1)
                    speedEle = popup.children[2];
                return speedEle;
            }
            else {
                qualityEle = popup.children[2];
                if (popup.children[1].innerHTML.indexOf(ej.MediaPlayer.SpeedText.Normal) == -1)
                    qualityEle = popup.children[1];
                return qualityEle;
            }
        };
        ejMediaPlayer.prototype._processYoutubeAPI = function (APIName, args) {
            if (this._youtubeIns) {
                return this._youtubeIns[APIName](args);
            }
        };
        ejMediaPlayer.prototype._processYoutubeAPIMultiArgs = function (APIName, args1, args2, args3) {
            if (this._youtubeIns) {
                return this._youtubeIns[APIName](args1, args2, args3);
            }
        };
        ejMediaPlayer.prototype._wireCommonEvents = function () {
            var mediaElements = this._mediaDiv.querySelector(".e-media-content-div").children;
            for (var i = 0; i < mediaElements.length; i++) {
                if (this._containsClass(mediaElements[i], "e-media-element"))
                    this._wireCommonEventsProcess(mediaElements[i]);
            }
            this._wireDocumentClickEvent();
            this._wireMouseMoveEvent();
            this._wireFullScreenChangeEvent();
            this._handleKeyBoardShortcuts();
            this._wireTouchEvent();
            this._wireSliderEvents();
            this._wireResizeEvents();
        };
        ejMediaPlayer.prototype._unwireCommonEvents = function () {
            this._mediaDiv.removeEventListener('mousemove', this._mouseMoveEvt);
            this._mediaDiv.removeEventListener('mouseleave', this._mouseLeaveEvt);
            document.removeEventListener('keydown', this._keyDownEvt);
            document.removeEventListener("fullscreenchange", this._fullScEvt);
            document.removeEventListener("webkitfullscreenchange", this._fullScEvt);
            document.removeEventListener("mozfullscreenchange", this._fullScEvt);
            document.removeEventListener("MSFullscreenChange", this._fullScEvt);
            document.removeEventListener('click', this._clickEvt);
            window.removeEventListener('mouseup', this._mouseUpEvt);
            window.removeEventListener('touchstart', this._touchStartEvt);
            window.removeEventListener('touchend', this._touchEndEvt);
            window.removeEventListener("resize", this._resizeEvt);
        };
        ejMediaPlayer.prototype._wireResizeEvents = function () {
            var ins = this;
            this._resizeEvt = function () {
                ins._setLowPriorityIconsVisibility();
                ins._hideSettingsPopup(null);
                ins._hideBasicVolSlider();
            };
            window.addEventListener("resize", this._resizeEvt);
        };
        ejMediaPlayer.prototype._wireSliderEvents = function () {
            var ins = this;
            this._mouseUpEvt = function () {
                ins._windowMouseup();
            };
            window.addEventListener("mouseup", this._mouseUpEvt);
            this._touchStartEvt = function (evt) {
                if (!evt.pointerType || evt.pointerType == "touch") {
                    ins._touchStarted = true;
                    ins._removeClass(ins._mediaDiv, "e-media-mouse");
                }
            };
            window.addEventListener("touchstart", this._touchStartEvt);
            window.addEventListener("MSPointerDown", this._touchStartEvt);
            this._touchEndEvt = function (evt) {
                if (!evt.pointerType || evt.pointerType == "touch") {
                    ins._windowMouseup();
                }
            };
            window.addEventListener("touchend", this._touchEndEvt);
            window.addEventListener("MSPointerUp", this._touchEndEvt);
        };
        ejMediaPlayer.prototype._windowMouseup = function () {
            var ins = this, sliderEle, mediaEle, volSlider;
            if (this._timeSliderClick) {
                this._timeSliderClick = false;
                sliderEle = this._mediaDiv.querySelector(".e-media-timeslider");
                this._removeClass(sliderEle.querySelector(".e-handle"), "e-media-slider-size");
                setTimeout(function () {
                    ins._onTimeSliderChange(ins._getEJControlInstance(sliderEle, "Slider").getValue());
                    if (ins._pausedManual) {
                        mediaEle = ins._getCurrentMedia();
                        if (ins._isYoutubeElement(mediaEle))
                            ins._playYoutubeVideo();
                        else
                            ins._playMedia(mediaEle);
                        ins._pausedManual = false;
                    }
                }, ins._sliderAnimation);
            }
            if (this._volSliderClick) {
                this._volSliderClick = false;
                volSlider = this._mediaDiv.querySelector(".e-media-volume-slider");
                setTimeout(function () {
                    ins._onVolSliderChange(ins._getEJControlInstance(volSlider, "Slider").getValue());
                    ins._removeClass(volSlider.querySelector(".e-handle"), "e-focus");
                }, ins._sliderAnimation);
            }
        };
        ejMediaPlayer.prototype._wireTouchEvent = function () {
            var ins = this;
            this._mediaDiv.querySelector(".e-media-content-div").addEventListener('touchstart', function (evt) {
                ins._tochStart = true;
            });
            this._mediaDiv.querySelector(".e-media-content-div").addEventListener('touchend', function (evt) {
                ins._tochStart = false;
            });
        };
        ejMediaPlayer.prototype._wireFullScreenChangeEvent = function () {
            var ins = this;
            this._fullScEvt = function (evt) {
                ins._onFullScreenChange();
            };
            document.addEventListener("fullscreenchange", this._fullScEvt);
            document.addEventListener("webkitfullscreenchange", this._fullScEvt);
            document.addEventListener("mozfullscreenchange", this._fullScEvt);
            document.addEventListener("MSFullscreenChange", this._fullScEvt);
        };
        ejMediaPlayer.prototype._onFullScreenChange = function () {
            var fullScreenEle = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;
            this._fullScreenChange(!fullScreenEle);
            if (fullScreenEle)
                this._hideMobilePlaylist();
            else
                this._showMobilePlaylist();
            this._hideSettingsPopup(null);
            this._hideTooltip();
            this._addClass(this._mediaDiv.querySelector(".e-media-time-tooltip"), "e-hide");
            this.focus();
        };
        ejMediaPlayer.prototype._handleKeyBoardShortcuts = function () {
            var ins = this;
            this._keyDownEvt = function (evt) {
                if (ins.model && !ins.model.disableKeys)
                    ins._onMediaKeydown(ins._getCurrentMedia(), evt);
            };
            document.addEventListener('keydown', this._keyDownEvt);
        };
        ejMediaPlayer.prototype._onMediaKeydown = function (mediaEle, evt) {
            if (this._closest(document.activeElement, ".e-media-player")) {
                var isYoutube, time, key, ctrl, shift, alt;
                isYoutube = this._isYoutubeElement(mediaEle);
                time = this._getCurrentMediaTime(mediaEle);
                key = evt.which || evt.keyCode;
                ctrl = evt.ctrlKey ? evt.ctrlKey : ((key === 17) ? true : false);
                shift = evt.shiftKey ? evt.shiftKey : ((key === 16) ? true : false);
                alt = evt.altKey ? evt.altKey : ((key === 18) ? true : false);
                if (ctrl && !shift && !alt)
                    this._controlKeyEvents(evt, key, mediaEle, time, isYoutube);
                else if (shift && !ctrl && !alt)
                    this._shiftKeyEvents(evt, key, mediaEle, time, isYoutube);
                else if (alt && !shift && !ctrl)
                    this._altKeyEvents(evt, key, mediaEle, time, isYoutube);
                else
                    this._otherKeyEvents(evt, key, mediaEle, time, isYoutube);
                this._screenKeydownEvents(evt);
                this._playVolumeEvents(evt, mediaEle);
            }
        };
        ejMediaPlayer.prototype._playVolumeEvents = function (evt, mediaEle) {
            var key = evt.which || evt.keyCode;
            switch (key) {
                case 32:
                    this._preventDefault(evt);
                    this._handlePlayIconClick(mediaEle);
                    break;
                case 77:
                    this._preventDefault(evt);
                    this._handleMuteBtnClick(mediaEle, this._mediaDiv.querySelector(".e-media-volume"));
                    break;
                default:
                    break;
            }
        };
        ejMediaPlayer.prototype._screenKeydownEvents = function (evt) {
            var key = evt.which || evt.keyCode;
            this.focus();
            switch (key) {
                case 27:
                    this._preventDefault(evt);
                    this._handleScreenBtnClick(true);
                    break;
                case 122:
                    this._preventDefault(evt);
                    this._handleScreenBtnClick(false);
                    break;
                default:
                    break;
            }
            this._addClass(this._mediaDiv.querySelector(".e-media-time-tooltip"), "e-hide");
        };
        ejMediaPlayer.prototype._otherKeyEvents = function (evt, key, mediaEle, time, isYoutube) {
            var volume = this._getVolume(mediaEle, isYoutube);
            switch (key) {
                case 37:
                    this._preventDefault(evt);
                    this._rewindMedia(mediaEle, 3);
                    break;
                case 39:
                    this._preventDefault(evt);
                    this._forwardMedia(mediaEle, 3);
                    break;
                case 38:
                    this._preventDefault(evt);
                    this._changeVolume(mediaEle, volume + 10, isYoutube);
                    break;
                case 40:
                    this._preventDefault(evt);
                    this._changeVolume(mediaEle, volume - 10, isYoutube);
                    break;
                default:
                    break;
            }
        };
        ejMediaPlayer.prototype._altKeyEvents = function (evt, key, mediaEle, time, isYoutube) {
            switch (key) {
                case 37:
                    this._preventDefault(evt);
                    this._rewindMedia(mediaEle, 10);
                    break;
                case 39:
                    this._preventDefault(evt);
                    this._forwardMedia(mediaEle, 10);
                    break;
                default:
                    break;
            }
        };
        ejMediaPlayer.prototype._shiftKeyEvents = function (evt, key, mediaEle, time, isYoutube) {
            var volume = this._getVolume(mediaEle, isYoutube);
            switch (key) {
                case 37:
                    this._preventDefault(evt);
                    this._rewindMedia(mediaEle, 3);
                    break;
                case 39:
                    this._preventDefault(evt);
                    this._forwardMedia(mediaEle, 3);
                    break;
                case 38:
                    this._preventDefault(evt);
                    this._changeVolume(mediaEle, volume + 10, isYoutube);
                    break;
                case 40:
                    this._preventDefault(evt);
                    this._changeVolume(mediaEle, volume - 10, isYoutube);
                    break;
                default:
                    break;
            }
        };
        ejMediaPlayer.prototype._controlKeyEvents = function (evt, key, mediaEle, time, isYoutube) {
            var volume = this._getVolume(mediaEle, isYoutube);
            switch (key) {
                case 37:
                    this._preventDefault(evt);
                    this._rewindMedia(mediaEle, 60);
                    break;
                case 38:
                    this._preventDefault(evt);
                    this._changeVolume(mediaEle, volume + 10, isYoutube);
                    break;
                case 39:
                    this._preventDefault(evt);
                    this._forwardMedia(mediaEle, 60);
                    break;
                case 40:
                    this._preventDefault(evt);
                    this._changeVolume(mediaEle, volume - 10, isYoutube);
                    break;
                default:
                    break;
            }
        };
        ejMediaPlayer.prototype._changeVolume = function (mediaEle, volume, isYoutube) {
            var basicVol, ins = this, sliderIns;
            this._onActionBegin({ mediaInfo: this._getCurrentMediaInfo(), volume: this.model.volume, actionType: "volumeChange" });
            basicVol = this._mediaDiv.querySelector(".e-media-vol-slider-li");
            if (basicVol) {
                this._showBasicVolSlider();
                window.clearTimeout(this._hideVolume);
                this._hideVolume = setTimeout(function () {
                    ins._hideBasicVolSlider();
                }, 1000);
            }
            this._setVolume(mediaEle, volume, isYoutube);
            sliderIns = this._getEJControlInstance(this._mediaDiv.querySelector(".e-media-volume-slider"), "Slider");
            sliderIns.option("value", this._getVolume(mediaEle, isYoutube));
            this._setMuteOnVolChange(volume, mediaEle);
            this._onActionComplete({ mediaInfo: this._getCurrentMediaInfo(), volume: this.model.volume, actionType: "volumeChange" });
        };
        ejMediaPlayer.prototype._wireMouseMoveEvent = function () {
            var ins = this;
            this._mouseMoveEvt = function (evt) {
                ins._handleAutoHide(evt);
                if (!ins._touchStarted)
                    ins._addClass(ins._mediaDiv, "e-media-mouse");
                else
                    ins._touchStarted = false;
                if (ins.model.renderMode == ej.MediaPlayer.RenderMode.Basic) {
                    if (ins._closest(evt.target, ".e-media-toolbar-volume-icon-li") || ins._containsClass(evt.target, "e-media-toolbar-volume-li") || ins._closest(evt.target, ".e-media-toolbar-volume-li"))
                        ins._showBasicVolSlider();
                    else
                        ins._hideBasicVolSlider();
                }
            };
            this._mediaDiv.addEventListener('mousemove', this._mouseMoveEvt);
            this._mediaDiv.addEventListener('touchmove', this._mouseMoveEvt);
            this._mouseLeaveEvt = function (evt) {
                ins._handleAutoHide(evt);
                ins._hideBasicVolSlider();
                ins._addClass(ins._mediaDiv, "e-media-mouse");
            };
            this._mediaDiv.addEventListener('mouseleave', this._mouseLeaveEvt);
        };
        ejMediaPlayer.prototype._isAllowAutoHide = function () {
            if (this._containsClass(this._mediaDiv.querySelector(".e-media-settings-popup"), "e-hide"))
                return true;
        };
        ejMediaPlayer.prototype._handleAutoHide = function (evt) {
            if (this.model.autoHide && this.model.contentType != ej.MediaPlayer.ContentType.Audio && this._isAllowAutoHide()) {
                if (evt && this._closest(evt.target, ".e-media-content-div"))
                    this._expandToolbar(evt);
                else
                    this._collapseToolbar(evt);
            }
            if (evt && this._closest(evt.target, ".e-media-content-div")) {
                this._fadeMobileIcons();
                this._fadeBasicIcons();
                this._fadePlayIcon();
            }
        };
        ejMediaPlayer.prototype._fadePlayIcon = function () {
            var centerIcon, hideTime, ins = this;
            centerIcon = this._mediaDiv.querySelector(".e-media-center-icon");
            this._fadeIn(centerIcon);
            hideTime = parseInt(this.model.autoHideTime.toString()) * 1000, ins = this;
            window.clearTimeout(this._playIconHide);
            ins._playIconHide = setTimeout(function () {
                ins._fadeOut(centerIcon);
            }, hideTime);
        };
        ejMediaPlayer.prototype._fadeMobileIcons = function () {
            var mobGroup, hideTime, ins = this;
            mobGroup = this._mediaDiv.querySelector(".mob-playGroup");
            if (mobGroup) {
                this._fadeIn(mobGroup);
                hideTime = parseInt(this.model.autoHideTime.toString()) * 1000, ins = this;
                window.clearTimeout(this._mobIconHide);
                ins._mobIconHide = setTimeout(function () {
                    ins._fadeOut(mobGroup);
                }, hideTime);
            }
        };
        ejMediaPlayer.prototype._fadeBasicIcons = function () {
            var prevIcon, nextIcon, hideTime, ins = this;
            prevIcon = this._mediaDiv.querySelector(".e-media-prev-li.basic");
            if (prevIcon) {
                nextIcon = this._mediaDiv.querySelector(".e-media-next-li.basic");
                this._fadeIn(prevIcon);
                this._fadeIn(nextIcon);
                hideTime = parseInt(this.model.autoHideTime.toString()) * 1000, ins = this;
                window.clearTimeout(this._mobIconHide);
                ins._mobIconHide = setTimeout(function () {
                    ins._fadeOut(prevIcon);
                    ins._fadeOut(nextIcon);
                }, hideTime);
            }
        };
        ejMediaPlayer.prototype._wireDocumentClickEvent = function () {
            var ins = this;
            this._clickEvt = function (evt) {
                if (ins._mediaDiv) {
                    if (ins._closest(evt.target, ".e-media-player")) {
                        ins._mediaDiv.focus();
                    }
                    ins._hideSettingsPopup(evt);
                    ins._handleAutoHide(null);
                    if (!ins._closest(evt.target, ".e-media-vol-slider-li"))
                        ins._hideBasicVolSlider();
                }
            };
            document.addEventListener('click', this._clickEvt);
        };
        ejMediaPlayer.prototype._wireMediaClickEvent = function () {
            var ins = this, controlEle;
            this._mediaDiv.querySelector(".e-media-content-div").addEventListener('click', function (evt) {
                controlEle = ins._mediaDiv.querySelector(".e-media-control-container");
                if (!ins._containsClass(evt.target, "e-media-toolbar-icon") && !ins._containsClass(evt.target, "e-media-toolbar-li") && controlEle.style.display != "none" && controlEle.style.opacity != "0") {
                    window.clearInterval(ins._playTimer);
                    ins._handlePlayIconClick(ins._getCurrentMedia());
                }
            });
        };
        ejMediaPlayer.prototype._wireCommonEventsProcess = function (mediaEle) {
            var tagName = mediaEle.nodeName.toLowerCase();
            if (tagName == "audio" || tagName == "video") {
                this._mediaEvents(mediaEle);
            }
        };
        ejMediaPlayer.prototype._mediaEvents = function (mediaEle) {
            this._raisePlayEvent(mediaEle);
            this._raisePlayingEvent(mediaEle);
            this._raiseLoadEvent(mediaEle);
            this._raiseMediaEndEvent(mediaEle);
        };
        ejMediaPlayer.prototype._raisePlayingEvent = function (videoEle) {
            var ins = this;
            videoEle.onplaying = function () {
                ins._onPlaying(videoEle);
            };
        };
        ejMediaPlayer.prototype._raisePlayEvent = function (videoEle) {
            var ins = this;
            videoEle.onplay = function () {
                ins._addPlayClass();
            };
        };
        ejMediaPlayer.prototype._raiseLoadEvent = function (mediaEle) {
            var ins = this;
            mediaEle.onloadeddata = function () {
                ins._setMediaDuration(mediaEle);
                ins._updateTimeStamp(mediaEle);
            };
        };
        ejMediaPlayer.prototype._raiseMediaEndEvent = function (videoEle) {
            var ins = this;
            videoEle.onended = function () {
                ins._onEndCurrentMedia(videoEle);
            };
        };
        ejMediaPlayer.prototype._onPlaying = function (videoEle) {
            this._trigger("onPlaying", { mediaInfo: this._getCurrentMediaInfo() });
            this.hideWaitingPopup();
            var ins = this;
            window.clearInterval(this._playTimer);
            this._playTimer = window.setInterval(function () {
                if (videoEle == ins._getCurrentMedia()) {
                    ins._updateTimeSlider(videoEle, null);
                    ins._updateTimeStamp(videoEle);
                }
            }, 10);
            this._addPauseClass();
        };
        ejMediaPlayer.prototype._fullScreenChange = function (isInFullScreen) {
            var fullElemet, smallElement;
            if (this.model.contentType != ej.MediaPlayer.ContentType.Audio) {
                if (!isInFullScreen) {
                    fullElemet = this._mediaDiv.querySelector(".e-media-fullscreen");
                    if (fullElemet) {
                        this._removeClass(fullElemet, "e-media-fullscreen");
                        this._addClass(fullElemet, "e-media-smallscreen");
                        this._addClass(this._mediaDiv, "fullscreen");
                    }
                }
                else {
                    smallElement = this._mediaDiv.querySelector(".e-media-smallscreen");
                    if (smallElement) {
                        this._removeClass(smallElement, "e-media-smallscreen");
                        this._addClass(smallElement, "e-media-fullscreen");
                        this._removeClass(this._mediaDiv, "fullscreen");
                    }
                }
                this._showWaitingPopup();
            }
        };
        ejMediaPlayer.prototype._setFullScreen = function () {
            if (this.model.contentType != ej.MediaPlayer.ContentType.Audio) {
                var mediaDiv = this._mediaDiv, fullscreenDiv, requestMethod;
                this._onActionBegin({ mediaInfo: this._getCurrentMediaInfo(), isFullScreen: this._containsClass(this._mediaDiv, "fullscreen"), actionType: "screenChange" });
                if (this._browserInfo.name == "msie" && parseInt(this._browserInfo.version) < 11) {
                    this._addClass(mediaDiv, "fullscreen");
                    fullscreenDiv = document.querySelector(".e-media-custom-fullscreen");
                    this._removeClass(fullscreenDiv, "e-hide");
                    this._parentElement = mediaDiv.parentElement;
                    fullscreenDiv.appendChild(mediaDiv);
                }
                else {
                    requestMethod = mediaDiv.requestFullScreen || mediaDiv.webkitRequestFullScreen || mediaDiv.mozRequestFullScreen || mediaDiv.msRequestFullscreen || mediaDiv.webkitEnterFullscreen;
                    if (requestMethod) {
                        requestMethod.call(mediaDiv);
                    }
                }
                this._setLowPriorityIconsVisibility();
                this._onActionComplete({ mediaInfo: this._getCurrentMediaInfo(), isFullScreen: this._containsClass(this._mediaDiv, "fullscreen"), actionType: "screenChange" });
            }
        };
        ejMediaPlayer.prototype._exitFullScreen = function () {
            if (this.model.contentType != ej.MediaPlayer.ContentType.Audio) {
                var fullscreenDiv, requestMethod;
                this._onActionBegin({ mediaInfo: this._getCurrentMediaInfo(), isFullScreen: this._containsClass(this._mediaDiv, "fullscreen"), actionType: "screenChange" });
                if (this._browserInfo.name == "msie" && parseInt(this._browserInfo.version) < 11) {
                    this._removeClass(this._mediaDiv, "fullscreen");
                    fullscreenDiv = document.querySelector(".e-media-custom-fullscreen");
                    this._addClass(fullscreenDiv, "e-hide");
                    this._parentElement.appendChild(this._mediaDiv);
                    fullscreenDiv.innerHTML = "";
                }
                else {
                    requestMethod = document.cancelFullScreen || document.webkitCancelFullScreen || document.mozCancelFullScreen || document.msExitFullscreen || document.webkitExitFullscreen;
                    if (requestMethod) {
                        requestMethod.call(document);
                    }
                }
                this._setLowPriorityIconsVisibility();
                this._onActionComplete({ mediaInfo: this._getCurrentMediaInfo(), isFullScreen: this._containsClass(this._mediaDiv, "fullscreen"), actionType: "screenChange" });
            }
        };
        ejMediaPlayer.prototype._showMobilePlaylist = function () {
            if (this.model.renderMode == ej.MediaPlayer.RenderMode.Mobile && this.model.showPlaylist) {
                this._removeClass(this._mediaDiv.querySelector(".e-media-playlist-container"), "e-hide");
                this._addClass(this._mediaDiv.querySelector(".e-media-playlist"), "e-media-playlist-visible");
                this._removeClass(this._mediaDiv.querySelector(".e-media-playlist-toggle"), "e-hide");
                this._collapsePlaylist();
            }
        };
        ejMediaPlayer.prototype._hideMobilePlaylist = function () {
            if (this.model.renderMode == ej.MediaPlayer.RenderMode.Mobile && this.model.showPlaylist) {
                this._addClass(this._mediaDiv.querySelector(".e-media-playlist-container"), "e-hide");
                this._removeClass(this._mediaDiv.querySelector(".e-media-playlist"), "e-media-playlist-visible");
                this._addClass(this._mediaDiv.querySelector(".e-media-playlist-toggle"), "e-hide");
            }
        };
        ejMediaPlayer.prototype._onYoutubePlayerReady = function (evt) {
            this._youtubeIns = evt.target;
            this._setMediaSettings(this._youtubeIns, true);
            if (this._youtubeMediaEle)
                this._changeMediaSource(this._youtubeMediaEle, true);
        };
        ejMediaPlayer.prototype._onYoutubeStateChange = function (evt) {
            var state = evt.data;
            if (state == YT.PlayerState.PLAYING) {
                this._setMediaDuration(this._getCurrentMedia());
                window.clearInterval(this._playTimer);
                this._onPlaying(this._getCurrentMedia());
            }
            else if (state == YT.PlayerState.ENDED)
                this._onEndCurrentMedia(this._getCurrentMedia());
        };
        ejMediaPlayer.prototype._onActionBegin = function (args) {
            this._trigger("onActionBegin", args);
        };
        ejMediaPlayer.prototype._onActionComplete = function (args) {
            this._trigger("onActionComplete", args);
        };
        ejMediaPlayer.prototype.play = function () {
            var currentMedia = this._getCurrentMedia();
            if (currentMedia) {
                if (this._isYoutubeElement(currentMedia))
                    this._playYoutubeVideo();
                else
                    this._playMedia(currentMedia);
            }
        };
        ejMediaPlayer.prototype.pause = function () {
            var currentMedia = this._getCurrentMedia();
            if (currentMedia) {
                if (this._isYoutubeElement(currentMedia))
                    this._pauseYoutubeVideo();
                else
                    this._pauseMedia(currentMedia);
            }
        };
        ejMediaPlayer.prototype.mute = function () {
            var currentMedia = this._getCurrentMedia(), volSlider, muteEle;
            if (currentMedia) {
                volSlider = this._mediaDiv.querySelector(".e-media-volume-slider");
                this._mute = true;
                this._manualMute = true;
                this._setModelMute(currentMedia, true, this._isYoutubeElement(currentMedia));
                if (volSlider)
                    this._getEJControlInstance(volSlider, "Slider").option("value", 0);
                muteEle = this._mediaDiv.querySelector(".e-media-volume");
                if (muteEle)
                    this._addClass(muteEle, "media-muted");
            }
        };
        ejMediaPlayer.prototype.unmute = function () {
            var currentMedia = this._getCurrentMedia(), volSlider, muteEle;
            if (currentMedia) {
                volSlider = this._mediaDiv.querySelector(".e-media-volume-slider");
                this._mute = false;
                this._manualMute = true;
                this._setModelMute(currentMedia, false, this._isYoutubeElement(currentMedia));
                if (volSlider)
                    this._getEJControlInstance(volSlider, "Slider").option("value", this._getVolume(currentMedia, this._isYoutubeElement(currentMedia)));
                muteEle = this._mediaDiv.querySelector(".e-media-volume");
                if (muteEle)
                    this._removeClass(muteEle, "media-muted");
            }
        };
        ejMediaPlayer.prototype.stop = function () {
            var currentMedia = this._getCurrentMedia();
            if (currentMedia)
                this._handleStopBtnClick(currentMedia);
        };
        ejMediaPlayer.prototype.next = function () {
            var currentMedia = this._getCurrentMedia();
            if (currentMedia)
                this._handleNextBtnClick(currentMedia);
        };
        ejMediaPlayer.prototype.previous = function () {
            var currentMedia = this._getCurrentMedia();
            if (currentMedia)
                this._handlePreviousBtnClick(currentMedia);
        };
        ejMediaPlayer.prototype.forward = function (time) {
            var currentMedia = this._getCurrentMedia(), forwardTime;
            if (currentMedia) {
                forwardTime = time || this.model.forwardTime || 10;
                this._forwardMedia(currentMedia, forwardTime);
            }
        };
        ejMediaPlayer.prototype.rewind = function (time) {
            var currentMedia = this._getCurrentMedia(), rewindTime;
            if (currentMedia) {
                rewindTime = time || this.model.rewindTime || 10;
                this._rewindMedia(currentMedia, rewindTime);
            }
        };
        ejMediaPlayer.prototype.setShuffle = function (isShuffle) {
            this._shuffle = (isShuffle == false) ? false : true;
            var shuffleEle = this._mediaDiv.querySelector(".e-media-shuffle");
            this._shuffle ? this._addClass(shuffleEle, "media-shuffled") : this._removeClass(shuffleEle, "media-shuffled");
            this._disablePrevNextIcons();
        };
        ejMediaPlayer.prototype.setRepeat = function (isRepeat) {
            this._repeat = (isRepeat == false) ? false : true;
            var repeatEle = this._mediaDiv.querySelector(".e-media-repeat");
            this._repeat ? this._addClass(repeatEle, "media-repeated") : this._removeClass(repeatEle, "media-repeated");
            this._disablePrevNextIcons();
        };
        ejMediaPlayer.prototype.seekTo = function (time) {
            var currentMedia = this._getCurrentMedia();
            if (currentMedia && time) {
                this._seekVideo(currentMedia, time, this._isYoutubeElement(currentMedia));
                this._getEJControlInstance(this._mediaDiv.querySelector(".e-media-timeslider"), "Slider").option("value", time);
            }
        };
        ejMediaPlayer.prototype.getCurrentMediaType = function () {
            var currentMedia = this._getCurrentMedia(), types;
            if (currentMedia) {
                types = ej.MediaPlayer.Types;
                if (currentMedia instanceof HTMLVideoElement)
                    return types.Video;
                else if (currentMedia instanceof HTMLAudioElement)
                    return types.Audio;
                else
                    return types.Youtube;
            }
        };
        ejMediaPlayer.prototype.getCurrentTime = function () {
            var currentMedia = this._getCurrentMedia();
            if (currentMedia)
                return this._getCurrentMediaTime(currentMedia);
        };
        ejMediaPlayer.prototype.setMediaSpeed = function (speed) {
            var currentMedia = this._getCurrentMedia();
            if (currentMedia) {
                this._onActionBegin({ mediaInfo: this._getCurrentMediaInfo(), speed: this.getMediaSpeed(), actionType: "speedChange" });
                this._setPlayerSpeed(currentMedia, speed, this._isYoutubeElement(currentMedia));
                this._onActionComplete({ mediaInfo: this._getCurrentMediaInfo(), speed: this.getMediaSpeed(), actionType: "speedChange" });
            }
        };
        ejMediaPlayer.prototype.getMediaSpeed = function () {
            var currentMedia = this._getCurrentMedia();
            if (currentMedia)
                return this._getPlayerSpeed(currentMedia, this._isYoutubeElement(currentMedia));
        };
        ejMediaPlayer.prototype.getDuration = function () {
            var currentMedia = this._getCurrentMedia();
            if (currentMedia) {
                if (this._isYoutubeElement(currentMedia))
                    return this._processYoutubeAPI("getDuration", null);
                else
                    return currentMedia.duration;
            }
        };
        ejMediaPlayer.prototype.setVolume = function (volume) {
            var currentMedia = this._getCurrentMedia(), volValue, volSlider;
            if (currentMedia) {
                volValue = volume || 50;
                this._setModelVolume(currentMedia, volValue, this._isYoutubeElement(currentMedia));
                volSlider = this._mediaDiv.querySelector(".e-media-volume-slider");
                if (volSlider)
                    this._getEJControlInstance(volSlider, "Slider").option("value", volValue);
            }
        };
        ejMediaPlayer.prototype.getVolume = function () {
            var currentMedia = this._getCurrentMedia();
            if (currentMedia)
                return this._getVolume(currentMedia, this._isYoutubeElement(currentMedia));
        };
        ejMediaPlayer.prototype.getCurrentMediaIndex = function () {
            return this._mediaIndex;
        };
        ejMediaPlayer.prototype.addMedia = function (media) {
            var playlistEle = this._mediaDiv.querySelector(".e-listbox");
            this.model.source.push(media);
            this._playlist.push(media);
            if (playlistEle)
                this._getEJControlInstance(playlistEle, "ListBox").option("dataSource", this._playlist);
        };
        ejMediaPlayer.prototype.removeMedia = function (media) {
            var mediaIdex = this._getIndexByMediaUrl(media.url), mediaSource, playlistEle;
            mediaSource = this._playlist[mediaIdex];
            if (mediaSource) {
                this._playlist.splice(mediaIdex, 1);
                playlistEle = this._mediaDiv.querySelector(".e-listbox");
                playlistEle = this._mediaDiv.querySelector(".e-listbox");
                if (playlistEle)
                    this._getEJControlInstance(playlistEle, "ListBox").option("dataSource", this._playlist);
            }
        };
        ejMediaPlayer.prototype.showPlaylist = function () {
            this._showPlaylist();
        };
        ejMediaPlayer.prototype.hidePlaylist = function () {
            this._hidePlaylist();
        };
        ejMediaPlayer.prototype.makeFullScreen = function () {
            this._setFullScreen();
        };
        ejMediaPlayer.prototype.exitFullScreen = function () {
            this._exitFullScreen();
        };
        ejMediaPlayer.prototype.focus = function () {
            this._mediaDiv.focus();
        };
        ejMediaPlayer.prototype.switchView = function (view) {
            if (view)
                this._changeRenderMode(view);
        };
        ejMediaPlayer.prototype._getIndexByMediaUrl = function (url) {
            var playlist = this._playlist;
            for (var i = 0; i < playlist.length; i++) {
                if (playlist[i].url == url)
                    return i;
            }
        };
        ejMediaPlayer.prototype._preventDefault = function (evt) {
            if (evt.preventDefault)
                evt.preventDefault();
            if (evt.stopPropagation)
                evt.stopPropagation();
            evt.returnValue = false;
        };
        ejMediaPlayer.prototype._getPopupPosition = function (popup) {
            var mediaDiv = this._mediaDiv, settingsBound, controlBound, popupBound, mediDivBound, bottom, left;
            settingsBound = mediaDiv.querySelector(".e-media-settings").getBoundingClientRect();
            controlBound = mediaDiv.querySelector(".e-media-control-container").getBoundingClientRect();
            popupBound = popup.getBoundingClientRect();
            mediDivBound = mediaDiv.querySelector(".e-media-content-div").getBoundingClientRect();
            bottom = controlBound.height;
            left = mediDivBound.width - popupBound.width;
            return { left: left, bottom: bottom };
        };
        ejMediaPlayer.prototype._setPopupPosition = function (popup) {
            var position = this._getPopupPosition(popup);
            popup.style.bottom = position.bottom.toString() + "px";
            popup.style.left = position.left.toString() + "px";
        };
        ejMediaPlayer.prototype._onEndCurrentMedia = function (mediaEle) {
            this._trigger("onMediaComplete", { mediaInfo: this._getCurrentMediaInfo() });
            this._addPlayClass();
            if (this.model.autoPlay)
                this._playVideoByIndex(mediaEle, this._mediaIndex + 1);
            else {
                window.clearInterval(this._playTimer);
                this._playTimer = null;
            }
        };
        ejMediaPlayer.prototype._playCurrentMediaAgain = function (mediaEle) {
            this._seekVideo(mediaEle, 0, this._isYoutubeElement(mediaEle));
            this._handlePlayIconClick(mediaEle);
        };
        ejMediaPlayer.prototype._setMediaDuration = function (mediaEle) {
            var sliderIns = this._getEJControlInstance(this._mediaDiv.querySelector(".e-media-timeslider"), "Slider"), duration;
            if (this._isYoutubeElement(mediaEle))
                duration = this._processYoutubeAPI("getDuration", null);
            else
                duration = mediaEle.duration;
            if (duration)
                sliderIns.setModel({ "maxValue": duration, "incrementStep": duration / 100 });
        };
        ejMediaPlayer.prototype._getMediaDuration = function (mediaEle) {
            if (this._isYoutubeElement(mediaEle))
                return this._processYoutubeAPI("getDuration", null);
            else
                return mediaEle.duration;
        };
        ejMediaPlayer.prototype._getCurrentMediaTime = function (mediaElement) {
            if (this._isYoutubeElement(mediaElement))
                return this._processYoutubeAPI("getCurrentTime", null);
            else if (mediaElement instanceof HTMLVideoElement || mediaElement instanceof HTMLAudioElement)
                return mediaElement.currentTime;
        };
        ejMediaPlayer.prototype._playVideoByIndex = function (mediaEle, index, isPlaylist) {
            var list, nextMediaObj, evtText, changedMedia;
            if (this._repeat) {
                if (index >= this._playlist.length)
                    index = 0;
                else if (index < 0)
                    index = this._playlist.length - 1;
            }
            if (!isPlaylist && this._shuffle)
                index = this._getRandomNumber(0, this._playlist.length - 1);
            window.clearInterval(this._playTimer);
            list = this._playlist;
            nextMediaObj = list[index];
            if (mediaEle && nextMediaObj) {
                this._stop(mediaEle);
                if (nextMediaObj.type != ej.MediaPlayer.Types.Youtube)
                    this.showWaitingPopup();
                evtText = this._mediaIndex > index ? "previous" : "next";
                this._onActionBegin({ mediaInfo: this._getCurrentMediaInfo(), actionType: evtText });
                this._mediaIndex = index;
                this._onActionBegin({ mediaInfo: this._getCurrentMediaInfo(), actionType: "mediaChange" });
                this._changeMediaSource(mediaEle);
                this._onActionComplete({ mediaInfo: this._getCurrentMediaInfo(), actionType: "mediaChange" });
                changedMedia = this._getCurrentMedia();
                this._addPlayClass();
                this._handlePlayIconClick(changedMedia);
                this._updateTimeSlider(changedMedia, null);
                this._onActionComplete({ mediaInfo: this._getCurrentMediaInfo(), actionType: evtText });
            }
        };
        ejMediaPlayer.prototype._pauseCurrentMedia = function (mediaEle) {
            if (this._isYoutubeElement(mediaEle))
                this._processYoutubeAPI("pauseVideo", null);
            else if (mediaEle instanceof HTMLVideoElement || mediaEle instanceof HTMLAudioElement)
                mediaEle.pause();
            window.clearInterval(this._playTimer);
        };
        ejMediaPlayer.prototype._playCurrentMedia = function (mediaEle) {
            if (this._isYoutubeElement(mediaEle))
                this._processYoutubeAPI("playVideo", null);
            else if (mediaEle instanceof HTMLVideoElement || mediaEle instanceof HTMLAudioElement)
                this._play(mediaEle);
        };
        ejMediaPlayer.prototype._isMediaPaused = function (mediaEle) {
            if (this._isYoutubeElement(mediaEle)) {
                if (this._processYoutubeAPI("getPlayerState", null) != "1")
                    return true;
            }
            else if (mediaEle instanceof HTMLVideoElement || mediaEle instanceof HTMLAudioElement)
                return mediaEle.paused;
        };
        ejMediaPlayer.prototype._changeMediaSource = function (mediaEle, isFirstLoad) {
            var list = this._playlist, nextMedia, currentType, currentMediaElement, url, isYoutube;
            this._disablePrevNextIcons();
            nextMedia = list[this._mediaIndex];
            if (nextMedia) {
                window.clearInterval(this._playTimer);
                this._pauseCurrentMedia(mediaEle);
                currentType = nextMedia.type;
                this._hideAllMedia();
                this._showCurrentMedia(currentType);
                currentMediaElement = this._getCurrentMediaFromType(currentType);
                url = list[this._mediaIndex].url;
                isYoutube = this._isYoutubeElement(currentMediaElement);
                if (isYoutube && !this._youtubeIns) {
                    this._youtubeMediaEle = currentMediaElement;
                }
                else {
                    this._setMediaSource(currentMediaElement, url, isYoutube, isFirstLoad);
                    this._setSubtitle(currentMediaElement, nextMedia.track, isYoutube);
                    this._setMute(currentMediaElement, this._mute, isYoutube);
                    this._changePlaylistItem();
                    this._setVideoTitle(currentMediaElement, nextMedia);
                    this._setAudioPoster(currentMediaElement, nextMedia);
                    this._setAudioTitle(currentMediaElement, nextMedia);
                    this._updateTimeStamp(currentMediaElement);
                }
                this._setQualityItemVisibility(isYoutube);
            }
        };
        ejMediaPlayer.prototype._disablePrevNextIcons = function () {
            var list = this._playlist;
            if (!list[this._mediaIndex - 1] && !this._repeat && !this._shuffle)
                this._addClass(this._mediaDiv.querySelector(".e-media-previous"), "disabled");
            else
                this._removeClass(this._mediaDiv.querySelector(".e-media-previous"), "disabled");
            if (!list[this._mediaIndex + 1] && !this._repeat && !this._shuffle)
                this._addClass(this._mediaDiv.querySelector(".e-media-next"), "disabled");
            else
                this._removeClass(this._mediaDiv.querySelector(".e-media-next"), "disabled");
        };
        ejMediaPlayer.prototype._setQualityItemVisibility = function (isYoutube) {
            var qualityList = this._mediaDiv.querySelector(".e-media-settings-popup").querySelector(".e-media-settings-quality");
            if (isYoutube) {
                this._removeClass(qualityList, "e-hide");
            }
            else {
                this._addClass(qualityList, "e-hide");
            }
        };
        ejMediaPlayer.prototype._updateAutoPlay = function () {
            var mediaEle = this._getCurrentMedia(), isYoutube;
            if (mediaEle) {
                isYoutube = this._isYoutubeElement(mediaEle);
                if (this.model.autoPlay) {
                    if (!isYoutube)
                        mediaEle.setAttribute("autoplay", "autoplay");
                    else
                        this._playYoutubeVideo();
                }
                else {
                    if (!isYoutube)
                        mediaEle.removeAttribute("autoplay");
                    else
                        this._pauseYoutubeVideo(true);
                }
            }
        };
        ejMediaPlayer.prototype._setVideoTitle = function (mediaEle, source) {
            var titleDiv = this._mediaDiv.querySelector(".e-media-video-baner");
            if (mediaEle instanceof HTMLAudioElement == false && this.model.showTitle) {
                this._removeClass(titleDiv, "e-hide");
                titleDiv.querySelector(".e-media-video-title").innerHTML = source.title;
            }
            else
                this._addClass(titleDiv, "e-hide");
        };
        ejMediaPlayer.prototype._setAudioPoster = function (mediaEle, source) {
            var detailDiv = this._mediaDiv.querySelector(".e-media-audio-detail");
            if (mediaEle instanceof HTMLAudioElement) {
                this._removeClass(detailDiv, "e-hide");
                this._mediaDiv.querySelector(".e-media-audio-poster").src = this._defaultPosterUrl;
            }
            else
                this._addClass(detailDiv, "e-hide");
        };
        ejMediaPlayer.prototype._setAudioTitle = function (mediaEle, source) {
            var detailDiv = this._mediaDiv.querySelector(".e-media-audio-detail");
            if (mediaEle instanceof HTMLAudioElement) {
                this._removeClass(detailDiv, "e-hide");
                this._mediaDiv.querySelector(".e-media-audio-title").innerHTML = source.title;
            }
            else
                this._addClass(detailDiv, "e-hide");
        };
        ejMediaPlayer.prototype._changePlaylistItem = function () {
            var playlist = this._mediaDiv.querySelector(".e-media-playlist-div"), currentMedia;
            currentMedia = playlist.querySelector(".e-select");
            if (currentMedia)
                this._removeClass(currentMedia, "e-select");
            this._addClass(playlist.children[this._mediaIndex], "e-select");
        };
        ejMediaPlayer.prototype._updateTimeSlider = function (videoEle, time) {
            var sliderIns = this._getEJControlInstance(this._mediaDiv.querySelector(".e-media-timeslider"), "Slider");
            if (time)
                sliderIns.option("value", parseFloat(time));
            else if (this._isYoutubeElement(videoEle))
                sliderIns.option("value", this._processYoutubeAPI("getCurrentTime", null));
            else if (videoEle instanceof HTMLVideoElement || videoEle instanceof HTMLAudioElement)
                sliderIns.option("value", videoEle.currentTime);
        };
        ejMediaPlayer.prototype._updateTimeStamp = function (mediaEle) {
            var mediaDiv = this._mediaDiv, timeStampRun, timeStampEnd, sliderIns, currentTime, duration;
            timeStampRun = mediaDiv.querySelector(".e-media-time-stamp-run");
            timeStampEnd = mediaDiv.querySelector(".e-media-time-stamp-end");
            sliderIns = this._getEJControlInstance(this._mediaDiv.querySelector(".e-media-timeslider"), "Slider");
            currentTime = sliderIns.model.value;
            duration = this._getMediaDuration(mediaEle);
            timeStampRun.innerText = this._getTimeFromSeconds(currentTime);
            if (!this._containsClass(timeStampRun, "e-media-mob"))
                timeStampRun.innerText += " /";
            timeStampEnd.innerText = this._getTimeFromSeconds(duration);
        };
        ejMediaPlayer.prototype._addPlayClass = function (isForce) {
            var pauseElement = this._mediaDiv.querySelector(".e-media-pause"), centerIcon;
            centerIcon = this._mediaDiv.querySelector(".e-media-center-icon");
            if ((isForce || this._isMediaPaused(this._getCurrentMedia())) && !this._pausedManual) {
                this._removeClass(pauseElement, "e-media-pause");
                this._addClass(pauseElement, "e-media-play");
                this._removeClass(centerIcon, "e-media-center-pause");
                this._addClass(centerIcon, "e-media-center-play");
                centerIcon.title = this._getLocaleString("Play");
            }
        };
        ejMediaPlayer.prototype._addPauseClass = function (isForce) {
            var playElement = this._mediaDiv.querySelector(".e-media-play"), centerIcon;
            centerIcon = this._mediaDiv.querySelector(".e-media-center-icon");
            if ((isForce || !this._isMediaPaused(this._getCurrentMedia())) && !this._pausedManual) {
                this._removeClass(playElement, "e-media-play");
                this._addClass(playElement, "e-media-pause");
                this._removeClass(centerIcon, "e-media-center-play");
                this._addClass(centerIcon, "e-media-center-pause");
                centerIcon.title = this._getLocaleString("Pause");
            }
            this._pausedManual = false;
        };
        ejMediaPlayer.prototype._getCurrentMedia = function () {
            var mediaElements = this._mediaDiv.querySelector(".e-media-content-div").children;
            for (var i = 0; i < mediaElements.length; i++) {
                if (this._containsClass(mediaElements[i], "e-media-element") && !this._containsClass(mediaElements[i], "e-hide"))
                    return mediaElements[i];
            }
        };
        ejMediaPlayer.prototype._showCurrentMedia = function (currentType) {
            var mediaEle = this._getCurrentMediaFromType(currentType);
            if (mediaEle)
                this._removeClass(mediaEle, "e-hide");
        };
        ejMediaPlayer.prototype._hideAllMedia = function () {
            var mediaDiv = this._mediaDiv, videoElement, audioElement, youtubeElement;
            videoElement = mediaDiv.querySelector(".e-media-video");
            audioElement = mediaDiv.querySelector(".e-media-audio");
            youtubeElement = mediaDiv.querySelector(".e-media-youtube");
            if (videoElement)
                this._addClass(videoElement, "e-hide");
            if (audioElement)
                this._addClass(audioElement, "e-hide");
            if (youtubeElement)
                this._addClass(youtubeElement, "e-hide");
        };
        ejMediaPlayer.prototype._getCurrentMediaFromType = function (currentType) {
            var mediaDiv = this._mediaDiv, mediaPlayerTypes;
            mediaPlayerTypes = ej.MediaPlayer.Types;
            if (currentType == mediaPlayerTypes.Video)
                return mediaDiv.querySelector(".e-media-video");
            else if (currentType == mediaPlayerTypes.Audio)
                return mediaDiv.querySelector(".e-media-audio");
            else if (currentType == mediaPlayerTypes.Youtube)
                return mediaDiv.querySelector(".e-media-youtube");
        };
        ejMediaPlayer.prototype._isYoutubeElement = function (mediaEle) {
            if (mediaEle && this._containsClass(mediaEle, "e-media-youtube"))
                return true;
        };
        ejMediaPlayer.prototype._createElement = function (tagName, id, classname, canCapture) {
            if (tagName && tagName != "") {
                var element, classList;
                if (tagName == "video")
                    element = document.createElement(tagName), canCapture = true;
                else
                    element = document.createElement(tagName);
                if (id && id != "")
                    element.id = id;
                if (classname && classname != "") {
                    classList = classname.split(' ');
                    for (var i = 0; i < classList.length; i++) {
                        this._addClass(element, classList[i]);
                    }
                }
                return element;
            }
            return null;
        };
        ejMediaPlayer.prototype._getYTVideoIdFromUrl = function (url) {
            var regExp, match;
            regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
            match = url.match(regExp);
            if (match && match[2].length == 11) {
                return match[2];
            }
        };
        ejMediaPlayer.prototype._getRandomNumber = function (min, max) {
            if (max != 0) {
                var randomNum;
                randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
                if (randomNum == this._mediaIndex)
                    randomNum = this._getRandomNumber(0, max);
                return randomNum;
            }
        };
        ejMediaPlayer.prototype._getTimeFromSeconds = function (duration) {
            var hours, minutes, seconds, hDisplay, mDisplay, sDisplay;
            duration = Number(duration);
            hours = Math.floor(duration / 3600);
            minutes = Math.floor(duration % 3600 / 60);
            seconds = Math.floor(duration % 3600 % 60);
            hDisplay, mDisplay, sDisplay;
            hDisplay = hours > 0 ? hours + ":" : "";
            if (minutes > 0) {
                if (minutes < 10 && hDisplay != "")
                    mDisplay = "0" + minutes + ":";
                else
                    mDisplay = minutes + ":";
            }
            else
                mDisplay = "0:";
            if (seconds > 0) {
                if (seconds < 10)
                    sDisplay = "0" + seconds;
                else
                    sDisplay = seconds;
            }
            else
                sDisplay = "00";
            return hDisplay + mDisplay + sDisplay;
        };
        ejMediaPlayer.prototype._addClass = function (element, className) {
            if (element && className) {
                if (element.classList)
                    element.classList.add(className);
                else if (!this._containsClass(element, className))
                    element.className += (element.className ? " " : "") + className;
            }
        };
        ejMediaPlayer.prototype._removeClass = function (element, className) {
            var classList;
            if (element) {
                if (element.classList)
                    element.classList.remove(className);
                else {
                    classList = element.className.split(" ");
                    element.className = "";
                    for (var j = 0; j < classList.length; j++) {
                        if (classList[j] != className)
                            element.className += (element.className ? " " : "") + classList[j];
                    }
                }
            }
        };
        ejMediaPlayer.prototype._containsClass = function (element, className) {
            var classList;
            if (element) {
                if (element.classList)
                    return element.classList.contains(className);
                else {
                    classList = element.className.split(" ");
                    for (var j = 0; j < classList.length; j++) {
                        if (classList[j] == className)
                            return true;
                    }
                }
            }
        };
        ejMediaPlayer.prototype._renderEJControls = function (element, type, properties) {
            var ejControl = new ej[type]($(element), properties);
        };
        ejMediaPlayer.prototype._getEJControlInstance = function (element, type) {
            return $(element).data("ej" + type);
        };
        ejMediaPlayer.prototype._animate = function (element, property, speed, callFunction) {
            if (!speed)
                speed = this._animationSpeed;
            $(element).animate(property, speed, callFunction);
        };
        ejMediaPlayer.prototype._stopAnimation = function (element) {
            $(element).stop();
        };
        ejMediaPlayer.prototype._fadeIn = function (element) {
            $(element).fadeIn("slow");
        };
        ejMediaPlayer.prototype._fadeOut = function (element) {
            $(element).fadeOut("slow");
        };
        ejMediaPlayer.prototype._closest = function (element, selector) {
            var $closeEle = $(element).closest(selector);
            if ($closeEle.length > 0)
                return $closeEle[0];
        };
        ejMediaPlayer.prototype._addPlaylistItemsAjax = function (dataSource, index, length) {
            var listItem = this._playlist[index], ins = this, videoId;
            if (listItem) {
                if (listItem.type == ej.MediaPlayer.Types.Youtube) {
                    videoId = this._getYTVideoIdFromUrl(listItem.url);
                    $.ajax({
                        url: "https://www.googleapis.com/youtube/v3/videos?id=" + videoId + "?key=" + this._APIKey + "=snippet",
                        dataType: "jsonp",
                        success: function (data) {
                            if (data && data.items && data.items[0] && data.items[0].snippet)
                                ins._addYoutubePlaylistData(data, listItem, index);
                            else
                                ins._addDefaultPlaylistValue(listItem, index);
                            ins._addNextPlaylistItem(dataSource, listItem, index);
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            ins._addDefaultPlaylistValue(listItem, index);
                            ins._addNextPlaylistItem(dataSource, listItem, index);
                        }
                    });
                }
                else {
                    ins._addDefaultPlaylistValue(listItem, index);
                    ins._addNextPlaylistItem(dataSource, listItem, index);
                }
            }
            else
                ins._generatePlaylistData(dataSource);
        };
        ejMediaPlayer.prototype._setHTMLCustomAttributes = function () {
            if (!Element.prototype.remove)
                Element.prototype.remove = function () {
                    if (this.parentNode) {
                        this.parentNode.removeChild(this);
                    }
                };
        };
        return ejMediaPlayer;
    }(ej.WidgetBase));
    window.ej.widget("ejMediaPlayer", "ej.MediaPlayer", new ejMediaPlayer());
    window["ejMediaPlayer"] = null;
})(jQuery);
ej.MediaPlayer.Types = {
    Audio: "audio",
    Video: "video",
    Youtube: "youtube"
};
ej.MediaPlayer.Quality = {
    "240p": "small",
    "360p": "medium",
    "480p": "large",
    "720p": "hd720",
    "1080p": "hd1080",
    "auto": "auto"
};
ej.MediaPlayer.SpeedText = {
    "Normal": "Normal"
};
ej.MediaPlayer.QualityText = {
    "Auto": "Auto"
};
ej.MediaPlayer.RenderMode = {
    Basic: "basic",
    Advanced: "advanced",
    Mobile: "mobile"
};
ej.MediaPlayer.ContentType = {
    Audio: "audio",
    Video: "video"
};
ej.MediaPlayer.Locale = ej.MediaPlayer.Locale || {};
ej.MediaPlayer.Locale['default'] = ej.MediaPlayer.Locale["en-US"] = {
    Play: "Play",
    Pause: "Pause",
    Mute: "Mute",
    Unmute: "Unmute",
    Settings: "Settings",
    FullScreen: "Full Screen",
    ExitFullScreen: "Exit Full Screen",
    HidePlaylist: "Hide Playlist",
    Previous: "Previous",
    Next: "Next",
    TogglePlaylist: "Toggle Playlist",
    Rewind: "Rewind",
    Forward: "Forward",
    Playlist: "Playlist",
    RepeatPlaylist: "Repeat Playlist",
    Shuffle: "Shuffle",
    VideoTitle: "Video",
    PlaylistTitle: "Playlist",
    PlaylistItemName: "List Item",
    PlaylistItemAuthor: "Author",
    Media: "Media"
};
