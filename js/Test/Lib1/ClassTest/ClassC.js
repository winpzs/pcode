/// <reference path="../../../reference-vsdoc.js" />
/// <reference path="ClassB.js" />
$pcode.Class("ClassTest.ClassC", ["ClassTest.ClassB"], function () {
    console.log("ClassTest.ClassC");
    return $pcode.DefineClass(ClassTest.ClassB)
        .DefineGroup("priC", { priC: 2 })
        .Define({
            c: 3,
            testRadio: function () {
                this.baseApply("testRadio", 0, arguments);
                console.log(this.c);
            }
        })
        .ReturnDefine();
});