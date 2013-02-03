/// <reference path="../../../reference-vsdoc.js" />
$pcode.Class("ClassTest.ClassB", [], function () {
    console.log("ClassTest.ClassB");
    return $pcode.DefineClass()
        .DefineGroup("priB", {priB:2})
        .Define({
            b: 2,
            testRadio: function (a, b) {
                console.log(this.b + "||" + a + "||" + b);
            }
        })
        .ReturnDefine();
});