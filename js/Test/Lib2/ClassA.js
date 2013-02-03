/// <reference path="../../../reference-vsdoc.js" />
/// <reference path="ClassB.js" />
/// <reference path="ClassC.js" />
$pcode.Class("Lib2.ClassA", [], function () {
    console.log("Lib2.ClassA");
    return $pcode.DefineClass()
        .Define({
            a:1
        })
        .Init(function () {
        })
        .ReturnDefine();
});
