/// <reference path="../../reference-vsdoc.js" />
/// <reference path="Dom/Move.js" />

$pcode.Class("Lib1.Box", ["Lib1.Dom.Move"], function () {
    //console.log("Box");

    //所有对Dom操作的类都扩展Lib1.Dom.DOM
    return $pcode.DefineClass(Lib1.Dom.DOM)
        .Static({
            BoxContent: null,
            getBoxContent: function () {
                /// <summary>
                /// 
                /// </summary>
                /// <returns type="jQuery"></returns>
                return this.BoxContent;
            },
            init: function () {
                $(function () {
                    Lib1.Box.BoxContent = $("#boxContent:first");
                });
            }
        })
        .Define({
            remove: function () {
                if (this.isDisposed) return;
                this.getDomTarget().remove();
            }
        })
        .Init(function () {
            var jTarget = $('<div class="box"></div>').appendTo(Lib1.Box.getBoxContent());
            this.baseCall("init", 0, jTarget);

            //支持拖动
            new Lib1.Dom.Move({ jqSelector: jTarget });

            var $obj = this;
            jTarget.dblclick(function () {
                //双击自我删除
                $obj.remove();
            });

            this.Event.onDispose(function () {
                //console.log("remove Box");
                jTarget = $obj = null;
            });
        })
        .ReturnDefine();
});
