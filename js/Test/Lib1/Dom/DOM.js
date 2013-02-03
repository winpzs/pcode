/// <reference path="../../../reference-vsdoc.js" />

$pcode.Class("Lib1.Dom.DOM", [], function () {
    "use strict";

    return $pcode.DefineClass()
        .DefineGroup("privateDOM", {
            jTarget: null,
            linkdom: null
        })
        .Define({
            getDomTarget: function () {
                /// <summary>
                /// 
                /// </summary>
                /// <returns type="jQuery"></returns>
                return this.privateDOM && this.privateDOM.jTarget;
            },
            remvoeDom: function () {
                /// <summary>
                /// 删除Lib1.Dom, 并响应onDispose事件
                /// </summary>
                //this.Event.triggerHandler
                this.getDomTarget().remove();
            },
            detachDom: function () {
                /// <summary>
                /// 对象与DOM分离, 并响应onDispose事件, 清除对象
                /// </summary>
                this.privateDOM && this.privateDOM.linkdom && this.privateDOM.linkdom.disconnect();
            },
            isExistDom: function () {
                /// <summary>
                /// 是否存在Lib1.Dom
                /// </summary>
                /// <returns type="Boolean"></returns>
                return this.privateDOM ? (this.getDomTarget().parent().size() > 0) : false;
            }
        })
        .Init(function (jqSeleort) {

            var $obj = this;
            var jTarget = $(jqSeleort);
            this.privateDOM.jTarget = jTarget;

            this.Event.onDispose(function () {
                $obj = null;
            });
            this.privateDOM.linkdom = this.linkToDom(jTarget);
            jTarget = null;

        })
        .ReturnDefine();

});

