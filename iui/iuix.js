(function () {
    var _1 = 20;
    var _2 = 0;
    var _3 = 30000;
    var _4 = null;
    var _5 = null;
    var _6 = null;
    var _7 = 0;
    var _8 = 0;
    var _9 = location.hash;
    var _a = "#_";
    var _b = [];
    var _c = 0;
    var _d;
    var _e = false;
    var _f = "portrait";
    var _10 = "landscape";
    window.iui = {
        logging: false,
        busy: false,
        animOn: true,
        ajaxErrHandler: null,
        httpHeaders: {
            "X-Requested-With": "XMLHttpRequest"
        },
        showPage: function (_11, _12) {
            if (_11) {
                if (_11 == _5) {
                    log("page = currentPage = " + _11.id);
                    iui.busy = false;
                    return;
                }
                if (_6) {
                    _6.removeAttribute("selected");
                    sendEvent("blur", _6);
                    _6 = null;
                }
                if (hasClass(_11, "dialog")) {
                    iui.busy = false;
                    sendEvent("focus", _11);
                    showDialog(_11);
                } else {
                    sendEvent("load", _11);
                    var _13 = _5;
                    sendEvent("blur", _5);
                    _5 = _11;
                    sendEvent("focus", _11);
                    if (_13) {
                        setTimeout(slidePages, 0, _13, _11, _12);
                    } else {
                        updatePage(_11, _13);
                    }
                }
            }
        },
        gotoView: function (_14, _15) {
            var _16, nodeId;
            if (_14 instanceof HTMLElement) {
                _16 = _14;
                nodeId = _16.id;
            } else {
                nodeId = _14;
                _16 = $(nodeId);
            } if (!_16) {
                log("gotoView: node is null");
            }
            if (!iui.busy) {
                iui.busy = true;
                var _17 = _b.indexOf(nodeId);
                var _18 = _17 != -1;
                if (_18) {
                    _b.splice(_17);
                } else {
                    if (_15) {
                        _b.pop();
                    }
                }
                iui.showPage(_16, _18);
                return false;
            } else {
                return true;
            }
        },
        showPageById: function (_19) {
            iui.gotoView(_19, false);
        },
        goBack: function () {
            iui.gotoView(_b.slice(-2, -1)[0], false);
        },
        replacePage: function (_1a) {
            gotoView(_1a, true);
        },
        showPageByHref: function (_1b, _1c, _1d, _1e, cb) {
            function spbhCB(xhr) {
                log("xhr.readyState = " + xhr.readyState);
                if (xhr.readyState == 4) {
                    if ((xhr.status == 200 || xhr.status == 0) && !xhr.aborted) {
                        var _21 = document.createElement("div");
                        _21.innerHTML = xhr.responseText;
                        sendEvent("beforeinsert", document.body, {
                            fragment: _21
                        });
                        if (_1e) {
                            replaceElementWithFrag(_1e, _21);
                            iui.busy = false;
                        } else {
                            iui.insertPages(_21);
                        }
                    } else {
                        iui.busy = false;
                        if (iui.ajaxErrHandler) {
                            iui.ajaxErrHandler("Error contacting server, please try again later");
                        }
                    } if (cb) {
                        setTimeout(cb, 1000, true);
                    }
                }
            }
            if (!iui.busy) {
                iui.busy = true;
                iui.ajax(_1b, _1c, _1d, spbhCB);
            } else {
                cb();
            }
        },
        ajax: function (url, _23, _24, cb) {
            var xhr = new XMLHttpRequest();
            _24 = _24 ? _24.toUpperCase() : "GET";
            if (_23 && _24 == "GET") {
                url = url + "?" + iui.param(_23);
            }
            xhr.open(_24, url, true);
            if (cb) {
                xhr.onreadystatechange = function () {
                    cb(xhr);
                };
            }
            var _27 = null;
            if (_23 && _24 != "GET") {
                xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                _27 = iui.param(_23);
            }
            for (var _28 in iui.httpHeaders) {
                xhr.setRequestHeader(_28, iui.httpHeaders[_28]);
            }
            xhr.send(_27);
            xhr.requestTimer = setTimeout(ajaxTimeout, _3);
            return xhr;

            function ajaxTimeout() {
                try {
                    xhr.abort();
                    xhr.aborted = true;
                } catch (err) {
                    log(err);
                }
            }
        },
        param: function (o) {
            var s = [];
            for (var key in o) {
                var _2c = o[key];
                if (typeof (_2c) == "object" && typeof (_2c.length) == "number") {
                    for (var i = 0; i < _2c.length; i++) {
                        s[s.length] = encodeURIComponent(key) + "=" + encodeURIComponent(_2c[i]);
                    }
                } else {
                    s[s.length] = encodeURIComponent(key) + "=" + encodeURIComponent(_2c);
                }
            }
            return s.join("&").replace(/%20/g, "+");
        },
        insertPages: function (_2e) {
            var _2f = _2e.childNodes;
            var _30;
            for (var i = 0; i < _2f.length; ++i) {
                var _32 = _2f[i];
                if (_32.nodeType == 1) {
                    if (!_32.id) {
                        _32.id = "__" + (++_c) + "__";
                    }
                    var _33 = $(_32.id);
                    var _34;
                    if (_33) {
                        _33.parentNode.replaceChild(_32, _33);
                        _34 = $(_32.id);
                    } else {
                        _34 = document.body.appendChild(_32);
                    }
                    sendEvent("afterinsert", document.body, {
                        insertedNode: _34
                    });
                    if (_32.getAttribute("selected") == "true" || !_30) {
                        _30 = _32;
                    }--i;
                }
            }
            sendEvent("afterinsertend", document.body, {
                fragment: _2e
            });
            if (_30) {
                iui.showPage(_30);
            }
        },
        getSelectedPage: function () {
            for (var _35 = document.body.firstChild; _35; _35 = _35.nextSibling) {
                if (_35.nodeType == 1 && _35.getAttribute("selected") == "true") {
                    return _35;
                }
            }
        },
        getAllViews: function () {
            return document.querySelectorAll("body > *:not(.toolbar)");
        },
        isNativeUrl: function (_36) {
            for (var i = 0; i < iui.nativeUrlPatterns.length; i++) {
                if (_36.match(iui.nativeUrlPatterns[i])) {
                    return true;
                }
            }
            return false;
        },
        nativeUrlPatterns: [new RegExp("^http://maps.google.com/maps?"), new RegExp("^mailto:"), new RegExp("^tel:"), new RegExp("^http://www.youtube.com/watch\\?v="), new RegExp("^http://www.youtube.com/v/"), new RegExp("^javascript:"), new RegExp("^sms:"), new RegExp("^callto:")],
        hasClass: function (_38, _39) {
            var re = new RegExp("(^|\\s)" + _39 + "($|\\s)");
            return re.exec(_38.getAttribute("class")) != null;
        },
        addClass: function (_3b, _3c) {
            if (!iui.hasClass(_3b, _3c)) {
                _3b.className += " " + _3c;
            }
        },
        removeClass: function (_3d, _3e) {
            if (iui.hasClass(_3d, _3e)) {
                var reg = new RegExp("(\\s|^)" + _3e + "(\\s|$)");
                _3d.className = _3d.className.replace(reg, " ");
            }
        }
    };
    addEventListener("load", function (_40) {
        var _41 = iui.getSelectedPage();
        var _42 = getPageFromLoc();
        if (_41) {
            _4 = _41;
            iui.showPage(_41);
        }
        if (_42 && (_42 != _41)) {
            iui.showPage(_42);
        }
        setTimeout(preloadImages, 0);
        if (typeof window.onorientationchange == "object") {
            window.onorientationchange = orientChangeHandler;
            _e = true;
            setTimeout(orientChangeHandler, 0);
        }
        setTimeout(checkOrientAndLocation, 0);
        _d = setInterval(checkOrientAndLocation, 300);
    }, false);
    addEventListener("unload", function (_43) {
        return;
    }, false);
    addEventListener("click", function (_44) {
        var _45 = findParent(_44.target, "a");
        if (_45) {
            function unselect() {
                _45.removeAttribute("selected");
            }
            if (_45.href && _45.hash && _45.hash != "#" && !_45.target) {
                followAnchor(_45);
            } else {
                if (_45 == $("backButton")) {
                    iui.goBack();
                } else {
                    if (_45.getAttribute("type") == "submit") {
                        var _46 = findParent(_45, "form");
                        if (_46.target == "_self") {
                            if (typeof _46.onsubmit == "function") {
                                if (_46.onsubmit() == true) {
                                    _46.submit();
                                }
                            } else {
                                _46.submit();
                            }
                            return;
                        }
                        submitForm(_46);
                    } else {
                        if (_45.getAttribute("type") == "cancel") {
                            cancelDialog(findParent(_45, "form"));
                        } else {
                            if (_45.target == "_replace") {
                                followAjax(_45, _45);
                            } else {
                                if (iui.isNativeUrl(_45.href)) {
                                    return;
                                } else {
                                    if (_45.target == "_webapp") {
                                        location.href = _45.href;
                                    } else {
                                        if (!_45.target && _45.href) {
                                            followAjax(_45, null);
                                        } else {
                                            return;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            _44.preventDefault();
        }
    }, true);
    addEventListener("click", function (_47) {
        var div = findParent(_47.target, "div");
        if (div && hasClass(div, "toggle")) {
            div.setAttribute("toggled", div.getAttribute("toggled") != "true");
            _47.preventDefault();
        }
    }, true);
    addEventListener("click", function (_49) {
        var _4a = findParent(_49.target, "input");
        if (_4a && _4a.type == "submit") {
            _4a.setAttribute("submitvalue", _4a.value);
        }
    }, true);
    addEventListener("submit", function (_4b) {
        var _4c = _4b.target;
        if (_4c.target != "_self") {
            _4b.preventDefault();
            submitForm(_4c);
        }
    }, true);

    function followAnchor(_4d) {
        _4d.setAttribute("selected", "true");
        var _4e = iui.gotoView(_4d.hash.substr(1), false);
        setTimeout(function () {
            _4d.removeAttribute("selected");
        }, _4e ? 0 : 500);
    }
    function followAjax(_4f, _50) {
        _4f.setAttribute("selected", "progress");
        iui.showPageByHref(_4f.href, null, "GET", _50, function () {
            _4f.removeAttribute("selected");
        });
    }
    function sendEvent(_51, _52, _53) {
        if (_52) {
            var _54 = document.createEvent("UIEvent");
            _54.initEvent(_51, false, false);
            if (_53) {
                for (i in _53) {
                    _54[i] = _53[i];
                }
            }
            _52.dispatchEvent(_54);
        }
    }
    function getPageFromLoc() {
        var _55;
        var _56 = location.hash.match(/#_([^\?_]+)/);
        if (_56) {
            _55 = _56[1];
        }
        if (_55) {
            _55 = $(_55);
        }
        return _55;
    }
    function orientChangeHandler() {
        var _57 = window.orientation;
        switch (_57) {
            case 0:
                setOrientation(_f);
                break;
            case 90:
            case -90:
                setOrientation(_10);
                break;
        }
    }
    function checkOrientAndLocation() {
        if (!_e) {
            if ((window.innerWidth != _7) || (window.innerHeight != _8)) {
                _7 = window.innerWidth;
                _8 = window.innerHeight;
                var _58 = (_7 < _8) ? _f : _10;
                setOrientation(_58);
            }
        }
        if (location.hash != _9) {
            var _59 = location.hash.substr(_a.length);
            if ((_59 == "") && _4) {
                _59 = _4.id;
            }
            iui.showPageById(_59);
        }
    }
    function setOrientation(_5a) {
        document.body.setAttribute("orient", _5a);
        if (_5a == _f) {
            iui.removeClass(document.body, _10);
            iui.addClass(document.body, _f);
        } else {
            if (_5a == _10) {
                iui.removeClass(document.body, _f);
                iui.addClass(document.body, _10);
            } else {
                iui.removeClass(document.body, _f);
                iui.removeClass(document.body, _10);
            }
        }
        setTimeout(scrollTo, 100, 0, 1);
    }
    function showDialog(_5b) {
        _6 = _5b;
        _5b.setAttribute("selected", "true");
        if (hasClass(_5b, "dialog")) {
            showForm(_5b);
        }
    }
    function showForm(_5c) {
        _5c.addEventListener("click", function (_5d) {}, true);
    }
    function cancelDialog(_5e) {
        _5e.removeAttribute("selected");
    }
    function updatePage(_5f, _60) {
        if (!_5f.id) {
            _5f.id = "__" + (++_c) + "__";
        }
        _9 = _a + _5f.id;
        if (!_60) {
            location.replace(_9);
        } else {
            location.assign(_9);
        }
        _b.push(_5f.id);
        var _61 = $("pageTitle");
        if (_5f.title) {
            _61.innerHTML = _5f.title;
        }
        var _62 = _5f.getAttribute("ttlclass");
        _61.className = _62 ? _62 : "";
        if (_5f.localName.toLowerCase() == "form") {
            showForm(_5f);
        }
        var _63 = $("backButton");
        if (_63) {
            var _64 = $(_b[_b.length - 2]);
            if (_64 && !_5f.getAttribute("hideBackButton")) {
                _63.style.display = "inline";
                _63.innerHTML = _64.title ? _64.title : "Backq";
                var _65 = _64.getAttribute("bbclass");
                _63.className = (_65) ? "button " + _65 : "button";
            } else {
                _63.style.display = "none";
            }
        }
        iui.busy = false;
    }
    function slidePages(_66, _67, _68) {
        var _69 = (_68 ? _66 : _67).getAttribute("axis");
        clearInterval(_d);
        sendEvent("beforetransition", _66, {
            out: true
        });
        sendEvent("beforetransition", _67, {
            out: false
        });
        if (canDoSlideAnim() && _69 != "y") {
            slide2(_66, _67, _68, slideDone);
        } else {
            slide1(_66, _67, _68, _69, slideDone);
        }
        function slideDone() {
            if (!hasClass(_67, "dialog")) {
                _66.removeAttribute("selected");
            }
            _d = setInterval(checkOrientAndLocation, 300);
            setTimeout(updatePage, 0, _67, _66);
            _66.removeEventListener("webkitTransitionEnd", slideDone, false);
            sendEvent("aftertransition", _66, {
                out: true
            });
            sendEvent("aftertransition", _67, {
                out: false
            });
            if (_68) {
                sendEvent("unload", _66);
            }
        }
    }
    function canDoSlideAnim() {
        return (iui.animOn) && (typeof WebKitCSSMatrix == "object");
    }
    function slide1(_6a, _6b, _6c, _6d, cb) {
        if (_6d == "y") {
            (_6c ? _6a : _6b).style.top = "100%";
        } else {
            _6b.style.left = "100%";
        }
        scrollTo(0, 1);
        _6b.setAttribute("selected", "true");
        var _6f = 100;
        slide();
        var _70 = setInterval(slide, _2);

        function slide() {
            _6f -= _1;
            if (_6f <= 0) {
                _6f = 0;
                clearInterval(_70);
                cb();
            }
            if (_6d == "y") {
                _6c ? _6a.style.top = (100 - _6f) + "%" : _6b.style.top = _6f + "%";
            } else {
                _6a.style.left = (_6c ? (100 - _6f) : (_6f - 100)) + "%";
                _6b.style.left = (_6c ? -_6f : _6f) + "%";
            }
        }
    }
    function slide2(_71, _72, _73, cb) {
        _72.style.webkitTransitionDuration = "0ms";
        var _75 = "translateX(" + (_73 ? "-" : "") + window.innerWidth + "px)";
        var _76 = "translateX(" + (_73 ? "100%" : "-100%") + ")";
        _72.style.webkitTransform = _75;
        _72.setAttribute("selected", "true");
        _72.style.webkitTransitionDuration = "";

        function startTrans() {
            _71.style.webkitTransform = _76;
            _72.style.webkitTransform = "translateX(0%)";
        }
        _71.addEventListener("webkitTransitionEnd", cb, false);
        setTimeout(startTrans, 0);
    }
    function preloadImages() {
        var _77 = document.createElement("div");
        _77.id = "preloader";
        document.body.appendChild(_77);
    }
    function submitForm(_78) {
        iui.addClass(_78, "progress");
        iui.showPageByHref(_78.getAttribute("action"), encodeForm(_78), _78.hasAttribute("method") ? _78.getAttribute("method") : "GET", null, function () {
            iui.removeClass(_78, "progress");
        });
    }
    function encodeForm(_79) {
        function encode(_7a) {
            for (var i = 0; i < _7a.length; ++i) {
                log("input[" + i + "]: " + _7a[i].name + " = " + _7a[i].value);
                if (_7a[i].name) {
                    var _7c = _7a[i];
                    if (_7c.getAttribute("type") == "checkbox" && !_7c.checked || _7c.getAttribute("type") == "radio" && !_7c.checked || _7c.disabled) {
                        continue;
                    }
                    if (_7c.getAttribute("type") == "submit") {
                        if (_7c.getAttribute("submitvalue")) {
                            _7c.removeAttribute("submitvalue");
                        } else {
                            continue;
                        }
                    }
                    var _7d = args[_7c.name];
                    if (_7d === undefined) {
                        args[_7c.name] = _7c.value;
                    } else {
                        if (_7d instanceof Array) {
                            _7d.push(_7c.value);
                        } else {
                            args[_7c.name] = [_7d, _7c.value];
                        }
                    }
                }
            }
        }
        var _7e = {};
        encode(_79.getElementsByTagName("input"));
        encode(_79.getElementsByTagName("textarea"));
        encode(_79.getElementsByTagName("select"));
        encode(_79.getElementsByTagName("button"));
        return _7e;
    }
    function findParent(_7f, _80) {
        while (_7f && (_7f.nodeType != 1 || _7f.localName.toLowerCase() != _80)) {
            _7f = _7f.parentNode;
        }
        return _7f;
    }
    function hasClass(_81, _82) {
        return iui.hasClass(_81, _82);
    }
    function replaceElementWithFrag(_83, _84) {
        var _85 = _83.parentNode;
        var _86 = _83;
        while (_85.parentNode != document.body) {
            _85 = _85.parentNode;
            _86 = _86.parentNode;
        }
        _85.removeChild(_86);
        var _87;
        while (_84.firstChild) {
            _87 = _85.appendChild(_84.firstChild);
            sendEvent("afterinsert", document.body, {
                insertedNode: _87
            });
        }
        sendEvent("afterinsertend", document.body, {
            fragment: _84
        });
    }
    function $(id) {
        return document.getElementById(id);
    }
    function log() {
        if ((window.console != undefined) && iui.logging) {
            console.log.apply(console, arguments);
        }
    }
})();