/// <reference path="../../../reference-vsdoc.js" />
/// <reference path="DOM.js" />

$pcode.Class("Lib1.Dom.Mouse", ["Lib1.Dom.DOM"], function () {
    "use strict";
    //UI.Debug.log("UI.Base.Mouse");

    var realDrag = false; //实时拖动? 费 CPU
    var isDown = false;
    var isMove = false;
    var lastMouseX = 0;
    var lastMouseY = 0;
    var tTM = null; //false;
    var _currentMouseObj = null;

    $(document).mousemove(function (e) {
        if (isDown) {
            e = e || window.event;
            var pos = $pcode.getMousePosition(e);
            var spanX = (pos.left - lastMouseX);
            var spanY = (pos.top - lastMouseY);
            var startDevi = _currentMouseObj ? _currentMouseObj.privateMouse.p.startDevi : 5;
            if (!realDrag && (spanX < startDevi && spanX > -startDevi && spanY < startDevi && spanY > -startDevi)) return false;
            isDown = false;
            isMove = true;
            if (_currentMouseObj) {
                _currentMouseObj.event = e;
                _currentMouseObj.Event.trigger("onDragStart", _currentMouseObj, pos, { x: spanX, y: spanY });
            }
            e = null;
            return false;
        } else if (isMove) {
            //if (!realDrag && tTM) return;
            //tTM = true;
            if (tTM != null) return false;
            e = e || window.event;
            tTM = setTimeout(function () {
                var pos = $pcode.getMousePosition(e);
                var spanX = (pos.left - lastMouseX);
                var spanY = (pos.top - lastMouseY);
                if (_currentMouseObj) {
                    _currentMouseObj.event = e;
                    _currentMouseObj.moveSpan(pos, spanX, spanY);
                }
                e = null;
                tTM = null;
            }, 0);
            //tTM = false;
            return false;
        } else {
            e = null;
            return true;
        }
    });

    var _isCapture = false;
    $(document).mouseup(function (e) {
        if (_isCapture) {
            if (window.captureEvents) {
                //window.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP);
                window.releaseEvents(Event.MOUSEMOVE | Event.MOUSEUP);
            } else if (document.body.releaseCapture) {
                document.body.releaseCapture();
            }
        }

        if (isMove && _currentMouseObj) {
            e = e || window.event;
            var pos = $pcode.getMousePosition(e);
            var spanX = (pos.left - lastMouseX);
            var spanY = (pos.top - lastMouseY);
            _currentMouseObj.event = e;
            _currentMouseObj.Event.trigger("onDragEnd", _currentMouseObj, pos, { x: spanX, y: spanY });
        }
        _currentMouseObj = null;
        e = null;

        if (isDown || isMove) {
            isDown = false;
            isMove = false;

            return false;
        }
    });
    //startMove

    return $pcode.DefineClass(Lib1.Dom.DOM)
        .Event({
            onInit: function (callback) {
                /// <summary>
                /// sender, pos//用于初始化, 返回false中断
                /// </summary>
                /// <param name="callback"></param>
                this.on("onInit", callback);
                return this;
            },
            onDragStart: function (callback) {
                /// <summary>
                /// sender, pos, posSpan
                /// </summary>
                /// <param name="callback"></param>
                this.on("onDragStart", callback);
                return this;
            },
            onDragging: function (callback) {
                /// <summary>
                /// sender, pos, posSpan
                /// </summary>
                /// <param name="callback"></param>
                this.on("onDragging", callback);
                return this;
            },
            onDragEnd: function (callback) {
                /// <summary>
                /// sender, pos, posSpan
                /// </summary>
                /// <param name="callback"></param>
                this.on("onDragEnd", callback);
                return this;
            }
        })
        .DefineGroup("privateMouse", {
            p: {
                jqSelector: $pcode.stringEmpty,
                startDevi: 5, //开始偏差
                capture: false, //capture时, 是否响应MouseOver事件
                realDrag: false,    //实时拖动
                eventReturn: false
            },
            moveSpan: function (moveObj, pos, spanX, spanY) {
                this.$this().Event.trigger("onDragging", moveObj, pos, { x: spanX, y: spanY });
                //this.p.onDragging(moveObj, pos, { x: spanX, y: spanY });
                moveObj = pos = null;
            },
            id: null,
            getMouseEventName: function () {
                return $pcode.format("mousedown.UI_Base_Mouse.T{0}", this.id);
            }
        })
        .Define({
            moveSpan: function (pos, spanX, spanY) {
                this.privateMouse.moveSpan(this, pos, spanX, spanY);
                pos = null;
            },
            removeMouse: function () {
                this.getDomTarget().off(this.privateMouse.getMouseEventName());
                //console.log(["removeMouse", this.privateMouse.getMouseEventName()]);
                this.detachDom();
            },
            event: null
        })
        .Init(function (p) {
            p = $pcode.extend(this.privateMouse.p, p || {});
            this.privateMouse.p = p;
            this.privateMouse.id = $pcode.makeAutoId();

            var $obj = this;
            var jTarget =  $(p.jqSelector);

            this.Event.onDispose(function () {
                $obj = jTarget = p = null;
            });

            this.baseCall("init", 0, jTarget);
            if (!this.isExistDom()) return;

            var capture = p.capture;
            //this.privateMouse.p.eventReturn
            jTarget.on(this.privateMouse.getMouseEventName(), function (e) {
                e = e || window.event;
                $obj.event = e;
                //console.log(e);
                var pos = $pcode.getMousePosition(e);

                if ($obj.Event.triggerHandler("onInit", $obj, pos) === false) return true;

                isMove = false;
                isDown = true;
                realDrag = p.realDrag;

                lastMouseX = pos.left;
                lastMouseY = pos.top;
                _currentMouseObj = $obj;

                //console.log([lastMouseX, lastMouseY]);

                if (!_isCapture) {
                    _isCapture = true;
                    if (window.captureEvents) {
                        //UI.Debug.log("captureEvents");
                        window.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP | Event.MOUSEOUT);
                    } else if (document.body.setCapture) {
                        document.body.setCapture(capture);
                    }
                }

                $pcode.eventCacelBubble(e);
                //console.log(p);
                return $obj.privateMouse.p.eventReturn;
            });
        })
        .ReturnDefine();

});