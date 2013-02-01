/// <reference path="pcode.validator-vsdoc.js" />

(function () {
    //version 1.0.1.31
    "use strict";
    var $pcode = window.$pcode;

    $pcode.validatorSetting({
        inline: true,  //是否内部验证, 如果false, 不绑定事件
        eventTriggers: "change", //绑定事件
        liveEvent: false, //是否用live绑定
        //验证前响应, 返回false, 跳过验证
        onValidationBefore: function (sender, element, rules) { return true; },
        //出错时响应, 用于出错时处理显示样式等
        onError: function (sender, element, rules, errors) { $(element).css({ "background-color": "Red", "border-color": "Red" }); console.log(errors); },
        //成功时响应, 用于成功时处理显示样式等
        onSuccess: function (sender, element, rules) { $(element).css({ "background-color": "Green", "border-color": "Green" }); },
        //清除Validator时响应, 用于清除时处理显示样式等
        onClearValidator: function (sender, element) { $(element).css({ "background-color": "", "border-color": "" }); }
    });

    var _customRegex = function (sender, element, rule) {
        if ($pcode.isNull(element)) return;

        var rulename = rule.name;
        var ruleRegex = rule.regex;
        if (!ruleRegex) return;

        var jTarget = $(element);
        var val = $pcode.trim(jTarget.val());
        if (!ruleRegex.test(val)) {
            sender.setErrorInfo(jTarget, rule.options[0], rule.alertText);
        }
    };

    var _required = function (sender, element, rule) {
        if ($pcode.isNull(element)) return;

        var jTarget = $(element);
        var elementType = jTarget.attr("type");
        switch (elementType) {
            case "checkbox":
                if (!jTarget.is(":checked")) {
                    sender.setErrorInfo(jTarget, rule.options[0], "该选项为必选项");
                }
                break;
            case "radio":
                if ($("input[name='" + jTarget.attr("name") + "']:checked").size() == 0) {
                    sender.setErrorInfo(jTarget, rule.options[0], "该选项为必选项");
                }
                break;
            default:
                if ($pcode.isNullEmpty($pcode.trim(jTarget.val()))) {
                    sender.setErrorInfo(jTarget, rule.options[0], "该输入项必填");
                }
                break;
        };
    };
    var _length = function (sender, element, rule) {
        if ($pcode.isNull(element)) return;

        var minL = rule.options[0];
        var maxL = rule.options[1];
        var feildLength = $pcode.trim($(element).val()).length;

        if (feildLength < minL || feildLength > maxL) {
            sender.setErrorInfo(element, rule.options[2], "输入值的长度必须在" + minL + "和" + maxL + "之间");
        }
    };
    var _range = function (sender, element, rule) {
        if ($pcode.isNull(element)) return;

        var min = rule.options[0];
        var max = rule.options[1];

        var jTarget = $(element);
        var elementType = jTarget.attr("type");
        switch (elementType) {
            case "checkbox":
                var groupSize = $("input[name='" + $(element).attr("name") + "']:checked").size();
                if (groupSize < min || groupSize > max) {
                    sender.setErrorInfo(jTarget, rule.options[2], "必须选择" + min + "到" + max + "选项");
                }
                break;
            default:
                var inputValue = parseFloat($pcode.trim(jTarget.val())) || 0;
                if (inputValue < min || inputValue > max) {
                    sender.setErrorInfo(jTarget, rule.options[2], "必须选择" + min + "到" + max + "选项");
                }
                break;
        };

    };
    var _confirm = function (sender, element, rule) {
        if ($pcode.isNull(element)) return;
        var confirmField = rule.options[0];

        var jTarget = $(element);
        if (jTarget.val() != $($pcode.format('#{0}, [name="{0}"]', confirmField)).val()) {
            sender.setErrorInfo(jTarget, rule.options[1], rule.alertText);
        }
    };

    $pcode.validatorRules({
        "required": {//required[必填]
            "executor": _required
        }, //
        "length": {//length[1,50, 从1到50]
            "executor": _length
        },
        "range": {//range[1,10,从1到10]
            "executor": _range
        },
        "equalToField": {//equalToField[testField,必须等于testField内容]
            "executor": _confirm,
            "alertText": "输入值与相关信息不相符"
        },
        "url": {//url[网址输入不正确]
            "regex": /^(http|https|ftp):\/\/(([A-Z0-9][A-Z0-9_-]*)(\.[A-Z0-9][A-Z0-9_-]*)+)(:(\d+))?\/?/i,
            "executor": _customRegex,
            "alertText": "网址输入不正确"
        },
        "qq": {
            "regex": /^[1-9][0-9]{4,}$/,
            "executor": _customRegex,
            "alertText": "QQ号码输入不正确（非零开头的四位以上的数字）"
        },
        "telephone": {
            "regex": /^(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}(\-\d{1,4})?$/,
            "executor": _customRegex,
            "alertText": "电话号码输入不正确"
        },
        "mobile": {
            "regex": /^1[3|5|8]\d{9}$/,
            "executor": _customRegex,
            "alertText": "手机号码输入不正确"
        },
        "zip": {
            "regex": /^[1-9]\d{5}$/,
            "executor": _customRegex,
            "alertText": "邮政编码输入不正确"
        },
        "email": {
            "regex": /^[a-zA-Z0-9_\.\-]+\@([a-zA-Z0-9\-]+\.)+[a-zA-Z0-9]{2,4}$/,
            "executor": _customRegex,
            "alertText": "邮箱地址输入不正确"
        },
        "date": {
            "regex": /^[0-9]{4}\-[0-9]{1,2}\-[0-9]{1,2}$/,
            "executor": _customRegex,
            "alertText": "日期输入格式不正确（YYYY-MM-DD）"
        },
        "identity": {
            "regex": /\d{15}|\d{18}/,
            "executor": _customRegex,
            "alertText": "身份证输入不正确"
        },
        "money": {
            "regex": /^[0-9]+(.[0-9]{1,2})?$/,
            "executor": _customRegex,
            "alertText": "金额格式输入不正确"
        },
        "integer": {
            "regex": /^\d+$/,
            "executor": _customRegex,
            "alertText": "输入值必须是正整数"
        },
        "double": {
            "regex": /^[0-9]+(.[0-9]{1,})?$/,
            "executor": _customRegex,
            "alertText": "输入值必须是数值"
        },
        "digit": {
            "regex": /^[0-9]+$/,
            "executor": _customRegex,
            "alertText": "只能输入数字"
        },
        "noSpecialCaracters": {
            "regex": /^[0-9a-zA-Z]+$/,
            "executor": _customRegex,
            "alertText": "不允许输入字母和数字之外的特殊字符"
        },
        "password":{
            "regex": /^[a-zA-Z]\w{5,17}$/,
            "executor": _customRegex,
            "alertText": "不允许输入字母和数字及下划线之外的特殊字符"
        },
        "letter": {
            "regex": /^[a-zA-Z]+$/,
            "executor": _customRegex,
            "alertText": "只允许输入英文"
        },
        "chinese": {
            "regex": /^[\u0391-\uFFE5]+$/,
            "executor": _customRegex,
            "alertText": "只允许输入中文"
        },
        "ip": {
            "regex": /^(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])$/,
            "executor": _customRegex,
            "alertText": "输入非法IP"
        }
    });

})();