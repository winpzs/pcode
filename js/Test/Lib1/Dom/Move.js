/// <reference path="../../../reference-vsdoc.js" />
/// <reference path="Mouse.js" />

$pcode.Class("Lib1.Dom.Move", ["Lib1.Dom.DOM", "Lib1.Dom.Mouse"], function () {
    "use strict";

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
            onMoveStart: function (callback) {
                /// <summary>
                /// sender, pos, posSpan
                /// </summary>
                /// <param name="callback"></param>
                this.on("onMoveStart", callback);
                return this;
            },
            onMoved: function (callback) {
                /// <summary>
                /// sender, pos, posSpan
                /// </summary>
                /// <param name="callback"></param>
                this.on("onMoved", callback);
                return this;
            },
            onMoving: function (callback) {
                /// <summary>
                /// sender, pos, posSpan
                /// </summary>
                /// <param name="callback"></param>
                this.on("onMoving", callback);
                return this;
            },
            onMoveBefore: function (callback) {
                /// <summary>
                /// sender, pos, posSpan如果返回false, 取消移动
                /// </summary>
                /// <param name="callback"></param>
                this.on("onMoveBefore", callback);
                return this;
            }
        })
        .DefineGroup("privateMove", {
            p: {
                jqSelector: $pcode.stringEmpty,
                eventReturn: false
            },
            jObj: null,
            mouse: null,
            pos: { left: 0, top: 0 },
            initPos: function () {
                this.pos = this.jObj.offset();
            },
            makePos: function (spanX, spanY) {
                return { left: this.pos.left + spanX, top: this.pos.top + spanY };
            },
            toSpan: function (pos) {
                return { x: pos.left - this.pos.left, y: pos.top - this.pos.top };
            },
            moveSpan: function (moveObj, spanX, spanY) {
                var pos = this.makePos(spanX, spanY);
                var posSpan = { x: spanX, y: spanY };
                //console.log('a');
                if (this.$this().Event.triggerHandler("onMoveBefore", moveObj, pos, posSpan) !== false) {
                    //console.log('aaa');
                    this.jObj.offset(pos);
                    this.$this().Event.trigger("onMoving", moveObj, pos, posSpan);
                }
                moveObj = pos = posSpan = null;
            },
            moveEndEvent: function (moveObj, posSpan) {
                var offset = this.jObj.offset();
                this.$this().Event.trigger("onMoved", moveObj, offset, this.toSpan(offset));
                offset = null;
            },
            moveStartEvent: function (moveObj, posSpan) {
                var offset = this.jObj.offset();
                this.$this().Event.trigger("onMoveStart", moveObj, offset, this.toSpan(offset));
                offset = null;
            }
        })
        .Define({
            event: null
        })
        .Init(function (p) {
            p = $pcode.extend(this.privateMove.p, p || {});
            this.privateMove.p = p;
            var $obj = this;
            var jObj = $(this.privateMove.p.jqSelector);
            this.privateMove.jObj = jObj;
            this.Event.onDispose(function () {
                //console.log("remove Move");
                $obj = jObj = p = null;
            });
            //Lib1.Dom.DOM.prototype.init.call(this, jObj);
            this.baseCall("init", 0, jObj);
            if (!this.isExistDom()) return;


            this.privateMove.mouse = new Lib1.Dom.Mouse({
                jqSelector: jObj,
                eventReturn: p.eventReturn
            }).Event
            .onInit(function (sender, pos) {
                $obj.event = sender.event;
                return $obj.Event.triggerHandler("onInit", $obj, pos);
            })
            .onDragStart(function (sender, pos, posSpan) {
                //console.log("onDragStart");
                $obj.event = sender.event;
                $obj.privateMove.initPos();
                //$obj.privateMove.p.onMoveStart($obj, pos);
                $obj.privateMove.moveStartEvent($obj, posSpan);
            })
            .onDragging(function (sender, pos, posSpan) {
                //console.log("onDragging");
                $obj.event = sender.event;
                //console.log(posSpan);
                $obj.privateMove.moveSpan($obj, posSpan.x, posSpan.y);
            })
            .onDragEnd(function (sender, pos, posSpan) {
                //console.log("onDragEnd");
                $obj.event = sender.event;
                $obj.privateMove.moveEndEvent($obj, posSpan);
            })
            .$this();


        })
        .ReturnDefine();

});