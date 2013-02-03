/// <reference path="../../reference-vsdoc.js" />
/// <reference path="ClassTest/ClassA.js" />
/// <reference path="Box.js" />

//下面我要定义Lib1.Main类名称
//引用Lib1.Box类名称, 数组
//类的定义方法
$pcode.Class("Lib1.Main", ["Lib1.Box"], function () {
    //如果当前库位置为 /js/Lib1
    //Lib1.Main ==> /js/Lib1/Main.js
    //Lib1.Box, ==> /js/Lib1/Box.js
    //./Lib2.ClassA, ==> /js/Lib2/ClassA.js
    //file:./jquery.js, ==> /js/jquery.js
    


    
    //console.log("Lib1.Main");

    //返回类的定义
    return $pcode.DefineClass()
        .Init(function () {

            $("#hBtnNewbox:first").click(function () {
                console.log("newBox");
                new Lib1.Box().Event.onDispose(function () {
                    console.log("remove Box");
                });
            });

        })
        .ReturnDefine();
});
