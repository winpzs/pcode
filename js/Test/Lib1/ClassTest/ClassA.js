/// <reference path="../../../reference-vsdoc.js" />
/// <reference path="ClassB.js" />
/// <reference path="ClassC.js" />
$pcode.Class("ClassTest.ClassA", ["ClassTest.ClassB", "ClassTest.ClassC"], function () {
    console.log("ClassTest.ClassA");
    return $pcode.DefineClass(ClassTest.ClassC, ClassTest.ClassB)
        .Define({
            a:1
        })
        .Init(function () {
        })
        .ReturnDefine();
});
