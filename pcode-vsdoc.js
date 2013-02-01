

(function () {
    window.console || (
        window.console = {
            log: function (val) {
            }
        });

    var stringEmpty = "",
        noop = function () { },
        tempObj = {};
    var functionType = typeof (noop);
    var _rootPathReg = /^\/|\:\/\//;

    var $pcode = window.$pcode = {
        stringEmpty: stringEmpty,
        noop: noop,
        isNull: function (obj) {
            ///<summary>是否Null</summary>

            return (obj == null || this.isUndefined(obj));
        },
        isUndefined: function (obj) {
            ///<summary>是否定义</summary>

            return (typeof (obj) == "undefined" || obj == undefined);
        },
        isObjectEmpty: function (obj) {
            if (this.isNull(obj)) return true;
            for (var n in obj) {
                if (obj.hasOwnProperty(n))
                    return false;
            }
            return true;
        },
        isNullEmpty: function (s) {
            return (this.isNull(s) || s == stringEmpty);
        },
        isFunction: function (fun) {
            return (typeof (fun) == functionType);
        },
        isString: function (obj) {
            return (typeof (this.stringEmpty) == typeof (obj) || (obj instanceof String));
        },
        isStringEquals: function (str1, str2) {
            ///<summary>字串是否相等, 不分大小写</summary>

            if (str1 == str2) return true;
            return (str1.toUpperCase() == str2.toUpperCase());
        },
        stringBLength: function (str) {
            ///<summary>字串字节数, 中文两个字节</summary>

            if (this.isNullEmpty(str)) return 0;
            return str.replace(/[^\x00-\xff]/g, "**").length;
        },
        newLine: "\r\n",
        isObject: function (obj) {
            return (!this.isNull(obj) && typeof (obj) == "object");
        },
        isArray: function (value) {
            return $.isArray(value);
        },
        sliceArray: function (args, pos, count) {
        	/// <summary>
            /// 节取 Array, 支持arguments
        	/// </summary>
            /// <param name="args">arguments</param>
            /// <param name="pos">开始位置, 空为0</param>
            /// <param name="count">数量, 空为结尾</param>
            return [];
        },
        isJquery: function (obj) {
            return (obj instanceof jQuery);
        },
        escape: function (s) {
            return stringEmpty;
        },
        unescape: function (s) {
            return stringEmpty;
        },
        trim: function (str) {
            return stringEmpty;
        },
        trimLeft: function (str) {
            return stringEmpty;
        },
        trimRigth: function (str) {
            return stringEmpty;
        },
        inArray: function (element, list) {
            if (list) {
                var len = list.length;
                if (len <= 0) return -1;
                for (var i = 0; i < len; i++) {
                    if (list[i] === element) return i;
                }
            }
            return -1;
        },
        mergeArray: function () {
            if (arguments.length <= 0) return [];
            var len = arguments.length;
            var list = [];
            for (var i = 0; i < len; i++) {
                for (var j = 0; j < arguments[i].length; j++) {
                    list.push(arguments[i][j]);
                }
            }
            return list;
        },
        removeArrayItem: function (element, list) {
            var list1 = [];
            var len = list1.length;
            for (var i = 0; i < len; i++) {
                if (list[i] != element)
                    list1.push(list[i]);
            }
            return list1;
        },
        makeAutoId: function () {
            ///<summary>生成维一ID， 只合适一个客户端页面</summary>
            return stringEmpty;
        },
        idBuilder: function (checkcallback, max, min, per) {
            /// <summary>
            /// 创建ID生成器
            /// <para>idBuilder(function(ids){ $pcode.linq(ids).where(function(){return this > 0;}).toArray();  }) </para>
            /// </summary>
            /// <param name="checkcallback"></param>
            /// <param name="max"></param>
            /// <param name="min"></param>
            /// <param name="per"></param>
            return { newId: this.noop, reset: $pcode.noop, clear: $pcode.noop };
        },
        isChildEvent: function (e, parentDom) {
            e = e || window.event;
            var o = e.relatedTarget || e.toElement;
            if (this.isNull(o)) return false;
            return true;
        },
        setCache: function (key, data, time) {
            /// <summary>
            /// 缓存 setCache("aaa", {aa:1,bbb:2}, 5);
            /// </summary>
            /// <param name="key"></param>
            /// <param name="data"></param>
            /// <param name="time">缓存时间, 分钟</param>
            /// <returns type=""></returns>
            return data;
        },
        getCache: function (key) {
            return {};
        },
        replace: function (s, str, repl) {
            ///<summary>字串替换, 替换所有匹配内容</summary>
            return stringEmpty;
        },
        getParam: function (str, name) {
            return stringEmpty;
        },
        setParam: function (str, name, value) {
            return stringEmpty;
        },
        setDataValue: function (data, name, value) {
            if (this.isNullEmpty(name)) return;
            var to = data;
            var item = name;
            if (name.indexOf('.')) {
                var list = name.split('.');
                var len = list.length - 1;
                for (var i = 0; i < len; i++) {
                    item = list[i];
                    if (this.isNull(to[item])) {
                        to = to[item] = {};
                    }
                }
                to[list[len]] = value;
            } else {
                data[name] = value;
            }
            to = null;
        },
        getDataValue: function (data, name) {
            if (this.isNullEmpty(name)) return null;
            var to = data;
            var item = name;
            if (name.indexOf('.')) {
                var list = name.split('.');
                var len = list.length;
                for (var i = 0; i < len; i++) {
                    item = list[i];
                    if (this.isNull(to[item])) {
                        return to[item];
                    }
                    to = to[item];
                }
                return to;
            } else {
                return data[name];
            }
            to = null;
        },
        getSelectText: function (selector) {
            return stringEmpty;
        },
        each: function (list, param, callback) {
            var temp = {
                value: null,
                index: -1,
                name: "",
                length: 0
            };
            if (!this.isFunction(param)) {
                this.extend(temp, param);
            } else {
                callback = param;
            }
            temp.callback = callback;
            //callback.apply(temp);
            return temp;
        },
        defaultValue: function (value, defaultValue) {
            return (value || defaultValue);
        },
        defaultProperty: function (value, propertyname, defaultValue) {
            return ((value && value[propertyname]) || defaultValue);
        },
        search: function (list, callback) {
            return [];
        },
        searchOne: function (list, callback) {
            return {};
        },
        format: function (fm) {
            return stringEmpty;
        },
        formatObject: function (fm) {
            return stringEmpty;
        },
        calcPath: function (url) {
            return stringEmpty;
        },
        getRelativePath: function (sUrl, sRelative) {
            ///<summary>
            ///getRelativePath("http://www.aaa.com/html/context/aaa.aspx")
            ///getRelativePath("/html/context/aaa.aspx")
            ///getRelativePath("http://www.aaa.com/html/context/aaa.aspx", "../bbb.aspx")
            ///getRelativePath("http://www.aaa.com/html/context/", "../aaa.aspx")
            ///getRelativePath("/html/context/", "../aaa.aspx")
            ///</summary>

            return stringEmpty;
        },
        createXHR: function () {
            if (window.ActiveXObject) {
                try { return new window.ActiveXObject("Microsoft.XMLHTTP"); } catch (e) { return new window.XMLHttpRequest(); }
            } else {
                try { return new window.XMLHttpRequest(); } catch (e) { return new window.ActiveXObject("Microsoft.XMLHTTP"); }
            }
        },
        getJSON: function (urls, datas, successCall, errorCall, types, asyncs) {
            return $.ajax({
                cache: false,
                async: ((asyncs == false) ? false : true),
                type: (this.isNullEmpty(types) ? "GET" : types),
                url: urls,
                data: datas,
                //dataType: "text",
                //success: successCall,
                dataType: "text",
                success: function (data) { if (successCall) successCall(JSON2.parse(data)); },
                error: errorCall
            });
        },
        getJSONsyncs: function (url, datas) {
            return {};
        },
        "get": function (urls, datas, successCall, errorCall, asyncs, dataType) {
            return $.ajax({
                cache: false,
                async: ((asyncs == false) ? false : true),
                type: "GET",
                url: urls,
                data: datas,
                dataType: this.isNullEmpty(dataType) ? "html" : dataType,
                success: successCall,
                error: errorCall
            });
        },
        getSyncs: function (url, datas) {
            return this.stringEmpty;
        },
        "post": function (urls, datas, successCall, errorCall, asyncs, dataType) {
            return $.ajax({
                cache: false,
                async: ((asyncs == false) ? false : true),
                type: "POST",
                url: urls,
                data: datas,
                dataType: this.isNullEmpty(dataType) ? "html" : dataType,
                success: successCall,
                error: errorCall
            });
        },
        "postSyncs": function (url, datas, dataType) {
            return this.stringEmpty;
        },
        imagePreload: function (src, onload) {
            onload();
        },
        htmlEncode: function (str) {
            return this.stringEmpty;
        },
        htmlDecode: function (str) {
            return this.stringEmpty;
        },
        urlEncode: function (str) {
            return this.stringEmpty;
        },
        urlDecode: function (str) {
            return this.stringEmpty;
        },
        getQueryString: function (url, item) {
            return this.stringEmpty;
        },
        queryString: function (item) {
            return this.stringEmpty;
        },
        removeRQItem: function (url, item) {
            return this.stringEmpty;
        },
        setQueryString: function (url, name, value) {
            return this.stringEmpty;
        },
        makeUrlAndQueryString: function (url) {
            return this.stringEmpty;
        },
        guid: function (_type) {
            return this.stringEmpty;
        },
        getDate: function (format) {
            return this.stringEmpty;
        },
        getNow: function () {
            return this.stringEmpty;
        },
        getTime: function () {
            return this.stringEmpty;
        },
        getMousePosition: function (e) {
            return { 'left': 0, 'top': 0 };
        },
        getEventKeycode: function (e) {
            return 0;
        },
        getEventTarget: function (e) {
            return {};
        },
        getFrameWindow: function (id) {
            return document.getElementById(id).contentWindow;
        },
        clearObject: function (obj) {
            for (var n in obj) {
                obj[n] = null;
                delete obj[n];
            }
        },
        cookie: function (name, value, options) {
            ///<summary>cookie("lLC", "1");</summary>
            ///<summary>cookie("lLC", "1", { expires: 100 });时间(天)</summary>
            ///<summary>cookie("lLC")时间(天)</summary>
            return this.stringEmpty;
        },
        extend: function (obj, ex) {
            var len = arguments.length;
            if (len <= 0) return obj;
            if (len <= 1) {
                for (var n0 in obj) {
                    this[n0] = obj[n0];
                }
                for (var nt0 in this) {
                    obj[nt0] = this[nt0];
                }
                return this;
            };
            var ot = null;
            for (var i = 1; i < len; i++) {
                ot = arguments[i];
                if (!this.isNull(ot)) {
                    for (var n in ot) {
                        obj[n] = ot[n];
                    }
                }
            };
            for (var nL0 in obj) {
                ex[nL0] = obj[nL0];
            }
            ex = null;
            return obj;
        },
        eventCacelBubble: function (e) {
            if (e && e.stopPropagation) //FF
            {
                e.stopPropagation();  //注释这句看效果
            }
            else  //IE
            {
                e.cancelBubble = true; //注释这句看效果
            }
        },
        cloneObject: function (obj, deep) {
            var to = {};
            var t = null;
            for (var n in obj) {
                t = obj[n];
                if (deep === true) {
                    if ($pcode.isArray(t)) {
                        t = this.cloneArray(t, deep);
                    } else if ($pcode.isObject(t)) {
                        t = this.cloneObject(t, deep);
                    }
                }
                to[n] = t;
            }
            t = null;
            return to;
        },
        cloneArray: function (list, deep) {
            var lt = [];
            var t = null;
            var len = list.length;
            for (var i = 0; i < len; i++) {
                t = list[i];
                if (deep === true) {
                    if ($pcode.isArray(t)) {
                        t = this.cloneArray(t, deep);
                    } else if ($pcode.isObject(t)) {
                        t = this.cloneObject(t, deep);
                    }
                }
                lt.push(t);
            }
            return lt;
        }
    };

})();

(function () {

    //环境类, 帮助解决闭包内存释放问题
    $pcode.extend({
        env: function () {
            /// <summary>
            /// 建立一个环境, 此方法已经过时, 不要使用
            /// </summary>
            /// <returns type=""></returns>
            var v = new $pcode.env.EnvClass();
            if ($pcode.isFunction(arguments[0])) {
                arguments[0].apply(v);
            } else if (!$pcode.isNull(arguments[0])) {
                $pcode.extend(v, arguments[0]);
                arguments[1].apply(v);
            }
            return v;
        },
        temp: function () {
            /// <summary>
            /// 此方法已经过时, 不要使用, 建立一个临时环境, 不自动建立环境链
            /// </summary>
            /// <returns type=""></returns>

            //return $env.apply(this, arguments).removeMeToParent_ps_20120101_t().clear_ps_20120101_t();
            var v = new $pcode.env.EnvClass();
            if ($pcode.isFunction(arguments[0])) {
                arguments[0].apply(v);
            } else if (!$pcode.isNull(arguments[0])) {
                $pcode.extend(v, arguments[0]);
                arguments[1].apply(v);
            }
            return v;
        }
    });

    $pcode.extend($pcode.env, {
        EnvClass: function () { }
    });

    $pcode.extend($pcode.env.EnvClass.prototype, {
        clear: function (callback) {
            if ($pcode.isFunction(callback))
                this.clearT = callback;
                //callback.apply(this);
            return this;
        }
    });

})();

(function () {

    $pcode.extend({
        importJS: function (path, filelist, callback) {
        	/// <summary>
            /// 异步加载js, 强化加载机会
            /// <para>importJS("a.js", ["b.js","c.js"], function(jsfile){})</para>
        	/// </summary>
        	/// <param name="path"></param>
        	/// <param name="filelist"></param>
        	/// <param name="callback"></param>
            callback();
        },
        usingJS: function (classname, usingclasslist, callback) {
            this.importJS(classname, usingclasslist, callback);
        },
        loadJS: function (url) {
        	/// <summary>
        	/// 简单实现同步加载js
            /// <para>loadJS("/scripts/jquery.js")</para>
            /// </summary>
        	/// <param name="url"></param>
            jqueryManager.load(url);
        }
    });

    $pcode.extend($pcode.importJS, {
        config: {
            jqurey: "%libpath%/jquery.js",
            importfilename: "pcode.js",
            classfile: "",
            debug: true,
            version: "1.0.0.0",
            path: {//这里可以设置路径, 用于%path%支持
                libpath: ""
            }
        }
    });

})();



(function () {
    $pcode.extend({
        Class: function (className, usinglist, callback) {
        	/// <summary>
        	/// 框架级定义类
            /// <para>Class("ClassA", ["ClassB"], function(jsfile){ return {}; })</para>
        	/// </summary>
        	/// <param name="className">类名称, Lib.ClassA</param>
        	/// <param name="usinglist">引用类</param>
        	/// <param name="callback">定义类实体</param>
            $pcode.Class.classDefine(className, callback());
        }
    });

    $pcode.extend($pcode.Class, {
        classDefine: function (className, classDefine, jsfile) {
            var def = this.makeClassDefine(className);
            $pcode.Class.Define(classDefine);
            if (classDefine.Static) {
                classDefine.Static.jsfile = $pcode.stringEmpty;
                if ($pcode.isFunction(classDefine.Static.init)) {
                    classDefine.Static.init();
                }
                $pcode.extend(def, classDefine.Static);
                delete classDefine.Static;
            }
            def.prototype = classDefine;
            def = null;
        },
        makeClassDefine: function (className) {
            var list = className.split('.');
            var ot = window;
            var n = "";
            var len = list.length - 1;
            for (var i = 0; i < len; i++) {
                n = list[i];
                if (!$pcode.isNullEmpty(n)) {
                    if ($pcode.isNull(ot[n]))
                        ot[n] = new Function("$pcode.Class.ResetObject(this);if (this.init) this.init.apply(this, arguments);");
                    ot = ot[n];
                }
            }
            if (ot[list[len]]) return ot[list[len]];
            return ot[list[len]] = new Function("$pcode.Class.ResetObject(this);if (this.init) this.init.apply(this, arguments);");
        },
        getClassDefine: function (className) {
            var list = className.split('.');
            var ot = window;
            var n = "";
            var len = list.length - 1;
            for (var i = 0; i < len; i++) {
                n = list[i];
                if (!$pcode.isNullEmpty(n)) {
                    if ($pcode.isNull(ot[n]))
                        return null;
                    ot = ot[n];
                }
            }
            return ot[list[len]];
            //return ot[list[len]] = new Function("$pcode.Class.ResetObject(this);if (this.init) this.init.apply(this, arguments);");
        },
        ResetObject: function (obj) {
            //分离对象属性, 这是必须的, 不然会引用原来对象属性
            $pcode.Class.ResetObject.ResetObjectAttribute(obj);
        },
        Define: function (objDefine) {
            //定义过滤, 和简单分离
            if (objDefine["extend"]) {
                //处理extend, 可以是
                $pcode.Class.Define.makeDefineAttribute(objDefine, objDefine["extend"]);
            }
            objDefine.isConstructorOf = function () { return true; };
            objDefine.baseApply = function (methodname, pos, args) {
            	/// <summary>
            	/// 调用基类方法(apply)
                /// <para>baseApply("init", 0, arguments)</para>
            	/// </summary>
            	/// <param name="methodname">基类方法名称</param>
            	/// <param name="pos"></param>
                /// <param name="args">arguments</param>
            };
            objDefine.baseCall = function (methodname, pos, params) {
            	/// <summary>
                /// 调用基类方法(call)
                /// <para>baseCall("init", 0, "1", "2")</para>
                /// </summary>
                /// <param name="methodname">基类方法名称</param>
            	/// <param name="pos"></param>
            	/// <param name="params">多个参数</param>
            };
            objDefine.dispose = function () {
                /// <summary>
                /// 清除对象本身引用, 以防内存泄漏, 手动调用
                /// </summary>
            };
            objDefine.linkToDom = function (jqSelector) {
            	/// <summary>
                /// 联接到DOM, 当DOM给删除时调用callback, 只能联一个
            	/// </summary>
            	/// <param name="jqSelector"></param>
                jqSelector = null;
            };
            objDefine = null;
        }
    });
    $pcode.extend($pcode.Class.Define, {
        makeDefineAttribute: function (objDefine, extendList) {
            var list = [];
            if ($pcode.isArray(extendList)) {
                list = extendList;
            } else {
                list.push(extendList);
            }

            var t = null;
            var extend = null;
            var len = list.length;
            for (var i = 0; i < len; i++) {
                extend = list[i].prototype;
                for (var n in extend) {
                    if (n == "extend" || n == "Static") continue;
                    if (n == "Protected") {
                        this.makeSpecialDefineAttribute(objDefine, extend, "Protected");
                        continue;
                    }
                    if (!$pcode.isUndefined(objDefine[n])) continue;
                    t = extend[n];
//                    if ($pcode.isArray(t)) {
//                        t = $pcode.cloneArray(t, true);
//                    } else if ($pcode.isObject(t)) {
//                        t = $pcode.cloneObject(t, true);
//                    }
                    objDefine[n] = t;
                }

                if (extend["extend"]) {
                    this.makeDefineAttribute(objDefine, extend["extend"]);
                }
            }
            t = null;
        },
        makeSpecialDefineAttribute: function (objDefine, extend, name) {
            var name = "Protected";
            var obj = $pcode.isNull(objDefine[name]) ? {} : objDefine[name];
            var ot = extend[name];
            var t = null;
            for (var n in ot) {
                t = ot[n];
//                if ($pcode.isArray(t)) {
//                    t = $pcode.cloneArray(t, true);
//                } else if ($pcode.isObject(t)) {
//                    t = $pcode.cloneObject(t, true);
//                }
                obj[n] = t;
            }
            objDefine[name] = obj;
        }
    });


    $pcode.extend($pcode.Class.ResetObject, {
        ResetObjectAttribute: function (obj) {
            var t = null;
            for (var n in obj) {
                if (n == "extend" || n == "Static") continue;
                t = obj[n];
                if ($pcode.isArray(t)) {
                    t = $pcode.cloneArray(t, true);
                } else if ($pcode.isObject(t)) {
                    t = $pcode.cloneObject(t, true);
                }
                obj[n] = t;
            }
            t = null;
        }
    });

})();

(function () {
    "use strict";

    $pcode.extend({
        DefineClass: function (extend) {
            /// <summary>
            /// 
            /// </summary>
            /// <param name="extend"></param>
            /// <returns type="$pcode.DefineClass.DefineClassClass"></returns>
            if (extend instanceof $pcode.DefineClass.DefineClassClass)
                return extend;
            return new $pcode.DefineClass.DefineClassClass(extend);
        }
    });

    $pcode.extend($pcode.DefineClass, {
        DefineClassClass: function (extend) {
            this.privateDefineClass = $pcode.cloneObject(this.privateDefineClass, true);
            this.privateDefineClass.define = {};
            this.privateDefineClass.define.isConstructorOf = function (Constructor) {
                /// <summary>
                /// 是否属于此类或基类
                /// </summary>
                /// <returns type="Boolean"></returns>
                return true;
            };
            this.privateDefineClass.define.getBaseMethod = function (methodname, pos) {
                /// <summary>
                /// 取得上级方法
                /// </summary>
                return $pcode.noop;
            };
            this.privateDefineClass.define["$classname"] = $pcode.stringEmpty;
            extend && this.Extend(extend);
            this.DefineGroup("Event", {
                on: function (eventnames, callback) {
                    /// <summary>
                    /// 绑定一个或多个事件
                    /// </summary>
                    /// <param name="eventnames">事件名称, 可用逗号分开</param>
                    /// <param name="callback"></param>
                    callback = null;
                    return this;
                },
                off: function (eventnames, callback) {
                    /// <summary>
                    /// 移除一个或多个事件
                    /// </summary>
                    /// <param name="eventnames">事件名称, 可用逗号分开</param>
                    /// <param name="callback"></param>
                    callback = null;
                    return this;
                },
                trigger: function (eventnames, args) {
                    /// <summary>
                    /// 确发一个或多个事件
                    /// </summary>
                    /// <param name="eventnames">事件名称, 可用逗号分开</param>
                    /// <param name="args"></param>
                    args = null;
                    return this;
                },
                triggerHandler: function (eventnames, args) {
                    /// <summary>
                    /// 确发一个或多个事件, 返回最后一个事件值
                    /// </summary>
                    /// <param name="eventnames">事件名称, 可用逗号分开</param>
                    /// <param name="args"></param>
                    args = null;
                    return this;
                },
                has: function (eventnames) {
                    /// <summary>
                    /// 是否有一个或多个事件
                    /// </summary>
                    /// <param name="eventnames">事件名称, 可用逗号分开</param>
                    return true;
                },
                onDispose: function (callback) {
                    /// <summary>
                    /// onDispose(function(sender){})
                    /// </summary>
                    /// <param name="callback"></param>
                    return this;
                }
            });
            this.Define({
                dispose: $pcode.noop,
                islinkToDom: true,
                linkToDom: function (jqSelector) { }
            });
            //var $this = this;
            //this.privateDefineClass.define.getDefineObject = function () { return $this; };
            //this.clear(function () { $this = null; });
            extend = null;
        }
    });

    $pcode.extend($pcode.DefineClass.DefineClassClass.prototype, {
        privateDefineClass: {
            define: {},
            makeDefineVsdoc: function () {
                //这个函数为vsdoc写
                $pcode.Class.Define(this.define);
                //classDefine.Static.jsfile = $pcode.stringEmpty;
                //if (classDefine.Static) {
                //delete classDefine.Static;
                //}
                if (this.define.extend) {
                    delete this.define.extend;
                }
                //def.prototype = classDefine;
                //def = null;
            }
        },
        //==================================
        Extend: function (extend) {
            /// <summary>
            /// 扩展
            /// </summary>
            /// <param name="extend"></param>
            /// <returns type="$pcode.DefineClass.DefineClassClass"></returns>
            if (this.privateDefineClass.define.extend) {
                this.privateDefineClass.define.extend = $pcode.mergeArray(this.privateDefineClass.define.extend, extend);
            } else {
                this.privateDefineClass.define.extend = extend;
            }
            this.privateDefineClass.makeDefineVsdoc();
            return this;
        },
        Static: function (define) {
            /// <summary>
            /// 定义静态属性/方法
            /// </summary>
            /// <param name="define"></param>
            /// <returns type="$pcode.DefineClass.DefineClassClass"></returns>
            if (!this.privateDefineClass.define.Static)
                this.privateDefineClass.define.Static = {};
            $pcode.extend(this.privateDefineClass.define.Static, define);
            return this;
        },
        DefineGroup: function (name, define) {
            /// <summary>
            /// 定义分组
            /// </summary>
            /// <param name="name"></param>
            /// <param name="define"></param>
            /// <returns type="$pcode.DefineClass.DefineClassClass"></returns>
            if (!this.privateDefineClass.define[name]) {
                this.privateDefineClass.define[name] = {};
            }
            $pcode.extend(this.privateDefineClass.define[name], define);
            if (!define.$this) {
                define.$this = function () { return this.$this.s; };
                define.$this.s = this.privateDefineClass.define;
                var a = define[name];
                setTimeout(function () { a.$this.s = null; a = null; }, 0);
            }
            return this;
        },
        Define: function (define) {
            /// <summary>
            /// 定义公共属性/方法
            /// </summary>
            /// <param name="define"></param>
            /// <returns type="$pcode.DefineClass.DefineClassClass"></returns>
            $pcode.extend(this.privateDefineClass.define, define);
            return this;
        },
        Event: function (define) {
            /// <summary>
            /// 定义事件
            /// </summary>
            /// <param name="define"></param>
            /// <returns type="$pcode.DefineClass.DefineClassClass"></returns>
            this.DefineGroup("Event", define);
            return this;
        },
        Init: function (callback) {
            /// <summary>
            /// 定义初始方法
            /// </summary>
            /// <param name="callback"></param>
            /// <returns type="$pcode.DefineClass.DefineClassClass"></returns>
            this.privateDefineClass.define.init = callback;
            return this;
        },
        ReturnDefine: function () {
            /// <summary>
            /// 返回定义
            /// </summary>
            return this.privateDefineClass.define;
        },
        Class: function (classname) {
            /// <summary>
            /// 定义为类
            /// </summary>
            /// <param name="classname"></param>
            return $pcode.Class.classDefine(classname, this.ReturnDefine(), $pcode.stringEmpty);
        }
    });

})();


(function () {
    "use strict";

    $pcode.extend({
        linq: function (list) {
            /// <summary>
            /// 创建linq
            /// </summary>
            /// <param name="list"></param>
            /// <returns type="$pcode.linq.LinqObject"></returns>
            if (list instanceof $pcode.linq.LinqObject)
                return list;
            return new $pcode.linq.LinqObject(list);
        }
    });

    $pcode.extend($pcode.linq, {
        LinqObject: function (list) {
            this.privateLinqObject = {
                list: [],
                result: []
            };
            this.from(list);
        },
        BREAK: "break_ps_20121206"
    });

    $pcode.extend($pcode.linq.LinqObject.prototype, {
        privateLinqObject: {
            list: [],
            result: []
        },
        from: function (list) {
            /// <summary>
            /// 设置来源 from([2, 1, 4, 3, 7, 8, 5])
            /// </summary>
            /// <param name="list"></param>
            /// <returns type="$pcode.linq.LinqObject"></returns>
            this.privateLinqObject.list = list;
            this.privateLinqObject.result = list;
            return this;
        },
        concat: function (list) {
            /// <summary>
            /// 添加来源 concat([2, 1, 4, 3, 7, 8, 5])
            /// </summary>
            /// <param name="list"></param>
            /// <returns type="$pcode.linq.LinqObject"></returns>
            this.privateLinqObject.list = list;
            this.privateLinqObject.result = list;
            return this;
        },
        where: function (callback) {
            /// <summary>
            /// 设置条件, 延迟 where(function(item, index){ item > 2})
            /// </summary>
            /// <param name="callback"></param>
            /// <returns type="$pcode.linq.LinqObject"></returns>
            //callback(item, index)
            if (this.privateLinqObject.list.length > 0) {
                callback.call(this.privateLinqObject.list[0], this.privateLinqObject.list[0], 0);
            }
            return this;
        },
        order: function (callback) {
            /// <summary>
            /// 排序, 延迟, order(function(item1, item2){return item1-item2;})
            /// </summary>
            /// <param name="callback"></param>
            /// <returns type="$pcode.linq.LinqObject"></returns>
            //callback(item1, item2)
            if (this.privateLinqObject.list.length > 0) {
                callback(this.privateLinqObject.list[0], his.privateLinqObject.list[0]);
            }
            return this;
        },
        unique: function () {
            /// <summary>
            /// 去除重复, 延迟, unique()
            /// </summary>
            /// <param name="callback"></param>
            /// <returns type="$pcode.linq.LinqObject"></returns>
            //callback(item1, item2)
            return this;
        },
        select: function (callback) {
            /// <summary>
            /// 设置select, 延迟, select(function(item){ return {name:item};})
            /// </summary>
            /// <param name="callback"></param>
            /// <returns type="$pcode.linq.LinqObject"></returns>
            //callback(item)
            if (this.privateLinqObject.list.length > 0) {
                this.privateLinqObject.result = [callback.call(this.privateLinqObject.list[0], this.privateLinqObject.list[0])];
            }
            return this;
        },
        selectMerge: function (callback) {
            /// <summary>
            /// 设置selectMerge, 延迟, selectMerge(function(item){ return item.getList();})
            /// </summary>
            /// <param name="callback"></param>
            /// <returns type="$pcode.linq.LinqObject"></returns>
            //callback(item)
            if (this.privateLinqObject.list.length > 0) {
                this.privateLinqObject.result = this.privateLinqObject.result.concat([callback.call(this.privateLinqObject.list[0], this.privateLinqObject.list[0])]);
            }
            return this;
        },
        take: function (pos, count) {
            /// <summary>
            /// 返回指定记录 take(0, 3)
            /// </summary>
            /// <param name="pos"></param>
            /// <param name="count"></param>
            /// <returns type="Array"></returns>
            return this.privateLinqObject.result;
        },
        toArray: function () {
            /// <summary>
            /// 返回查询结果
            /// </summary>
            /// <returns type="Array"></returns>
            return this.privateLinqObject.result;
        },
        clear: function (callback) {
            /// <summary>
            /// 计算结束时, 清除变量用, 只能一个callback
            /// </summary>
            /// <param name="callback"></param>
            /// <returns type="$pcode.linq.LinqObject"></returns>
            return this;
        },
        each: function (callback) {
            /// <summary>
            /// 对返回结果遍历, each(function(item, index){ console.log([item, index]); })
            /// <para>要手动调用clear</para>
            /// </summary>
            /// <param name="callback"></param>
            /// <returns type="$pcode.linq.LinqObject"></returns>
            var list = this.toArray();
            if (list, length > 0)
                callback.call(list[0], list[0], 0);
            else {
                callback.call(null, 0);
            }
            return this;
        },
        first: function (defalutvalue) {
            /// <summary>
            /// 第一个记录
            /// </summary>
            /// <param name="defalutvalue">如果没有值时的默认值</param>
            var list = this.privateLinqObject.result;
            if (list.length <= 0)
                return $pcode.isFunction(defalutvalue) ? defalutvalue() : defalutvalue;
            else
                return list[0];
        },
        last: function (defalutvalue) {
            /// <summary>
            /// 最后记录
            /// </summary>
            /// <param name="defalutvalue">如果没有值时的默认值</param>
            var list = this.privateLinqObject.result;
            var len = list.length;
            if (len <= 0)
                return $pcode.isFunction(defalutvalue) ? defalutvalue() : defalutvalue;
            else
                return list[len - 1];
        },
        contain: function () {
            /// <summary>
            /// 是否有值
            /// </summary>
            /// <returns type="Boolean"></returns>
            return !$pcode.isNull(this.first());
        },
        group: function (callback) {
            /// <summary>
            /// 分组, 延迟, group(function(item, index){ return item.group;})
            /// </summary>
            /// <param name="callback"></param>
            /// <returns type="$pcode.linq.LinqObject"></returns>
            this.privateLinqObject.result = [{ value: null, items: this.privateLinqObject.result}];
            return this;
        },
        count: function (callback) {
            /// <summary>
            /// 记录数量 count();  count(function(){return item > 0;})
            /// </summary>
            /// <returns type="Number"></returns>
            if (callback && this.privateLinqObject.result.length > 0) {
                callback.call(this.privateLinqObject.result[0], this.privateLinqObject.result[0], 0);
            } else {
                return this.privateLinqObject.result.length;
            }
        },
        sum: function (callback) {
            /// <summary>
            /// 求和 sum();  sum(function(){return item * 10;})
            /// </summary>
            /// <returns type="Number"></returns>
            if (callback && this.privateLinqObject.result.length > 0) {
                callback.call(this.privateLinqObject.result[0], this.privateLinqObject.result[0], 0);
            } else {
                return 0;
            }
        },
        avg: function (callback) {
            /// <summary>
            /// 求平均值 avg();  avg(function(){return item * 10;})
            /// </summary>
            /// <returns type="Number"></returns>
            if (callback && this.privateLinqObject.result.length > 0) {
                callback.call(this.privateLinqObject.result[0], this.privateLinqObject.result[0], 0);
            } else {
                return 0;
            }
        }
    });
})();



(function () {
    $pcode.extend({
        linkToDom: function (jSelector, callback) {
            /// <summary>
            /// 联接到DOM, 当DOM给删除时调用callback
            /// <para>$pcode.linkToDom("#id", function(){});</para>
            /// </summary>
            /// <param name="jSelector"></param>
            /// <param name="callback"></param>
            return { id: $pcode.stringEmpty, target: null,
                unlink: function () {
                	/// <summary>
                    /// 断开与DOM的连接,不调用callback
                	/// </summary>
                },
                disconnect: function () {
                	/// <summary>
                    /// 断开与DOM的连接, 并调用callback
                	/// </summary>
                } 
            };
        },
        unlinkToDom: function (link) {
            /// <summary>
            /// 断开与DOM的连接, 不调用callback
            /// </summary>
            /// <param name="link">linkToDom返回的link对象</param>
            link = null;
        },
        disconnectToDom: function (link) {
            /// <summary>
            /// 断开与DOM的连接, 并调用callback
            /// </summary>
            /// <param name="link">linkToDom返回的link对象</param>
            link = null;
        }
    });

})();


(function () {
    "use strict";

    $pcode.extend({
        linEv: function (obj) {
            /// <summary>
            /// 
            /// </summary>
            /// <param name="obj"></param>
            /// <returns type="$pcode.linEv.linEvObject"></returns>
            if (obj instanceof $pcode.linEv.linEvObject)
                return obj;
            return new $pcode.linEv.linEvObject(obj);
        }
    });

    $pcode.extend($pcode.linEv, {
        linEvObject: function (obj) {
            var objIn = new $pcode.linEv.linEvObjectClass();
            if (obj) {
                $pcode.extend(objIn, obj);
            }
            var $this = this;
            objIn.getLinEvObject = function () {
                /// <summary>
                /// 取得$pcode.linEv对象
                /// </summary>
                /// <returns type="$pcode.linEv.linEvObject"></returns>
                return $this;
            };
            objIn.onDispose(function () { $this = null; });
            this.privateLinEvObject.obj = objIn;
            obj = objIn = null;
        }
    });

    $pcode.extend($pcode.linEv.linEvObject.prototype, {
        privateLinEvObject: {
            obj: null
        },
        //==================================
        extend: function (obj) {
            /// <summary>
            /// 扩展属性
            /// </summary>
            /// <param name="obj"></param>
            /// <returns type="$pcode.linEv.linEvObject"></returns>
            $pcode.extend(this.privateLinEvObject.obj, obj);
            //$pcode.extend(obj, this.privateLinEvObject.obj);
            obj = null;
            return this;
        },
        define: function (callback) {
            /// <summary>
            /// 定义
            /// </summary>
            /// <param name="callback"></param>
            /// <returns type="$pcode.linEv.linEvObject"></returns>
            callback && callback.apply(this.privateLinEvObject.obj);
            callback = null;
            return this;
        },
        init: function (callback) {
            /// <summary>
            /// 初始化
            /// </summary>
            /// <param name="callback"></param>
            /// <returns type="$pcode.linEv.linEvObject"></returns>
            callback && callback.apply(this.privateLinEvObject.obj);
            callback = null;
            return this;
        },
        event: function (define) {
            /// <summary>
            /// 定义事件
            /// </summary>
            /// <param name="define"></param>
            $pcode.extend(this.privateLinEvObject.obj.Event, define);
            define = null;
            return this;
        },
        eval: function (callback) {
            /// <summary>
            /// 执行
            /// </summary>
            /// <param name="callback"></param>
            /// <returns type="$pcode.linEv.linEvObject"></returns>
            callback && callback.apply(this.privateLinEvObject.obj);
            callback = null;
            return this;
        },
        ready: function (callback) {
            /// <summary>
            /// 文档加载完成执行
            /// </summary>
            /// <param name="callback"></param>
            /// <returns type="$pcode.linEv.linEvObject"></returns>
            //callback && callback.apply(this.privateLinEvObject.obj);
            this.privateLinEvObject.obj.readyTemp = callback;
            callback = null;
            return this;
        },
        async: function (callback, time) {
            /// <summary>
            /// 异步执行
            /// </summary>
            /// <param name="callback"></param>
            /// <returns type="$pcode.linEv.linEvObject"></returns>
            callback && callback.apply(this.privateLinEvObject.obj);
            callback = null;
            return this;
        },
        each: function (callback) {
            /// <summary>
            /// 遍历属性
            /// </summary>
            /// <param name="callback"></param>
            /// <returns type="$pcode.linEv.linEvObject"></returns>
            callback && callback.call(this.privateLinEvObject.obj, {}, $pcode.stringEmpty);
            return this;
        },
        clear: function (callback) {
            /// <summary>
            /// 清除, callback为空时, 立即删除, callback转入obj
            /// <para>clear(function(obj){})</para>
            /// <para>clear()</para>
            /// </summary>
            /// <param name="callback"></param>
            /// <returns type="$pcode.linEv.linEvObject"></returns>
            //callback && (this.privateLinEvObject.obj.clearTFun = callback);
            callback = null;
            return this;
        },
        linkToDOM: function (jqselector) {
            /// <summary>
            /// 连接到DOM, 如DOM删除, 自动调用clear
            /// </summary>
            /// <param name="jqselector">jQuery选择语法</param>
            /// <returns type="$pcode.linEv.linEvObject"></returns>
            return this;
        },
        evalReturn: function (callback, keep) {
            /// <summary>
            /// 执行并返回
            /// </summary>
            /// <param name="callback"></param>
            /// <param name="keep">是否保存环境, 默认否</param>
            return ((callback && callback.apply(this.privateLinEvObject.obj)) || this.privateLinEvObject.obj);
        }
    });

    $pcode.DefineClass()
        .Define({
            onDispose: function (callback) {
                /// <summary>
                /// onDispose(function(sender){});
                /// </summary>
                /// <param name="callback"></param>
                this.Event.onDispose(callback);
                callback = null;
            }
        })
        .Class("$pcode.linEv.linEvObjectClass");

})();



(function () {

    $pcode.extend({
        databind: function (jqselector, data, map, convert) {
        	/// <summary>
            /// databind
        	/// </summary>
        	/// <param name="jqselector"></param>
        	/// <param name="data"></param>
        	/// <param name="map">可以为空</param>
        	/// <param name="convert">可以为空 </param>
            /// <returns type="$pcode.databind.databindClass"></returns>
            return new $pcode.databind.databindClass(jTarget, data, map, convert);
        },
        dataUnbind: function (jqselector) {
        	/// <summary>
            /// 解除databind
        	/// </summary>
        	/// <param name="jqselector"></param>
        },
        databindSubmit: function (jqselector, autoUnbind) {
        	/// <summary>
        	/// 提交数据
        	/// </summary>
        	/// <param name="jqselector"></param>
        	/// <param name="autoUnbind">如果为true, 自动解除绑定</param>
        }
    });

    $pcode.DefineClass()
        .Event({
            onSetData: function (callback) {
                /// <summary>
                /// sender, data, jtarget
                /// </summary>
                /// <param name="callback"></param>
                /// <returns type=""></returns>
                return this;
            },
            onSetDataBefore: function (callback) {
                /// <summary>
                /// sender, data, jtarget
                /// </summary>
                /// <param name="callback"></param>
                /// <returns type=""></returns>
                return this;
            },
            onSubmit: function (callback) {
                /// <summary>
                /// sender, data, jtarget
                /// </summary>
                /// <param name="callback"></param>
                /// <returns type=""></returns>
                return this;
            },
            onSubmitBefore: function (callback) {
                /// <summary>
                /// sender, data, jtarget
                /// </summary>
                /// <param name="callback"></param>
                /// <returns type=""></returns>
                return this;
            },
            onChangeBefore: function (callback) {
                /// <summary>
                /// sender, name, value, data, jtarget
                /// <para>返回false阻止修改</para>
                /// </summary>
                /// <param name="callback"></param>
                /// <returns type=""></returns>
                return this;
            }
        })
        .Define({
            getDomTarget: function () {
            	/// <summary>
            	/// 
            	/// </summary>
                /// <returns type="jQuery"></returns>
                return $();
            },
            getData: function () {
                return {};
            },
            setData: function (data) {
                return this;
            },
            extendMap: function (map, convert) {
            	/// <summary>
            	/// 添加展bind map
            	/// </summary>
            	/// <param name="map"></param>
            	/// <param name="convert"></param>
                return this;
            },
            getTarget: function (name) {
            	/// <summary>
            	/// 
            	/// </summary>
            	/// <param name="name"></param>
                /// <returns type="jQuery"></returns>
                return $();
            },
            val: function (name, value) {
                if (arguments.length == 1) {
                    return {}
                } else {
                    return this;
                }
            },
            submit: function () {
                return this;
            },
            unlink: function () {
            	/// <summary>
            	/// 
            	/// </summary>
            }
        })
        .Class("$pcode.databind.databindClass");
})();

(function () {

    $pcode.extend({
        render: function (s, datas) {
        	/// <summary>
            /// render('<div>{{:title}}</div>', {title:'test'})
            /// <para>render('#tmplid', {title:'test'})</para>
        	/// </summary>
        	/// <param name="s">可以文本和jquery selector</param>
        	/// <param name="datas"></param>
            $pcode.stringEmpty;
        },
        renderCompile: function (s) {
            /// <summary>
            /// 编译模板
            /// renderCompile('<div>{{:title}}</div>').render({title:"标题"});
            /// </summary>
            /// <param name="s">可以文本和jquery selector</param>
            return $pcode.render.compile(s);
        }
    });

    $pcode.extend($pcode.render, {
        compile: function (s) {
        	/// <summary>
        	/// 编译模板文本
        	/// </summary>
            /// <param name="s">可以文本和jquery selector</param>
            return {
                render: function (datas) {
                    return $pcode.stringEmpty;
                }
            };
        },
        tags: function (define) {
        	/// <summary>
            /// 扩展模板语义
            /// <para>tags({ html: function(value){ return $pcode.htmlEncode(value); } })</para>
            /// <para>{{html title}}</para>
            /// </summary>
        	/// <param name="define"></param>
            define = null;
        }
    });

    $pcode.extend($pcode.render.compile, {
        isDebug: false
    });

})();


(function () {

    $pcode.extend({
        validator: function (jqselector) {
            /// <summary>
            /// 生成验证器
            /// <para>validator("#form1")</para>
            /// </summary>
            /// <param name="jqselector"></param>
            /// <returns type="$pcode.validator.ValidatorClass"></returns>
            return new $pcode.validator.ValidatorClass();
        },
        validatorRules: function (rules) {
            /// <summary>
            /// 设置验证规则
            /// <para>validator({length:{}})</para>
            /// </summary>
            /// <param name="rules"></param>
        },
        validatorSetting: function (setting) {
            /// <summary>
            /// 设置默认设置
            /// </summary>
            /// <param name="setting"></param>
        },
        validatorVerify: function (setting) {
            /// <summary>
            /// 验证
            /// </summary>
            /// <param name="setting"></param>
            return true;
        },
        validatorClear: function (setting) {
            /// <summary>
            /// 清除验证
            /// </summary>
            /// <param name="setting"></param>
        }
    });


    $pcode.DefineClass()
        .Event({
            onValidationBefore: function (callback) {
                /// <summary>
                /// 验证前响应, 返回false, 跳过验证
                /// <para>sender, element, rules</para>
                /// </summary>
                /// <param name="callback"></param>
                //this.off("onValidationBefore");
                this.on("onValidationBefore", callback);
                callback = null;
                return this;
            },
            onError: function (callback) {
                /// <summary>
                /// 出错时响应, 用于出错时处理显示样式等
                /// <para>sender, element, rules, errors</para>
                /// </summary>
                /// <param name="callback"></param>
                this.on("onError", callback);
                callback = null;
                return this;
            },
            onSuccess: function (callback) {
                /// <summary>
                /// 成功时响应, 用于成功时处理显示样式等
                /// <para>sender, element, rules</para>
                /// </summary>
                /// <param name="callback"></param>
                this.on("onSuccess", callback);
                callback = null;
                return this;
            },
            onClearValidator: function (callback) {
                /// <summary>
                /// 清除Validator时响应, 用于清除时处理显示样式等
                /// <para>sender, element</para>
                /// </summary>
                /// <param name="callback"></param>
                this.on("onClearValidator", callback);
                callback = null;
                return this;
            }
        })
        .Define({
            getTarget: function () {
                /// <summary>
                /// 
                /// </summary>
                /// <returns type="jQuery"></returns>
            },
            getAllValidatoElements: function () {
                /// <summary>
                /// 取得所有出错元素
                /// </summary>
                return [];
            },
            setErrorInfo: function (element, text, defaultText) {
                /// <summary>
                /// 设置出错信息
                /// </summary>
                /// <param name="element"></param>
                /// <param name="text"></param>
                /// <param name="defaultText"></param>
            },
            clearErrorInfo: function (element) {
                /// <summary>
                /// 清除出错信息
                /// </summary>
                /// <param name="element"></param>
                element = null;
            },
            getAllErrorInfo: function () {
                /// <summary>
                /// 取得所有出错信息
                /// </summary>
                return [];
            },
            verify: function () {
                /// <summary>
                /// 验证, 返回true/false
                /// </summary>
                return true;
            },
            clearValidation: function () {
                /// <summary>
                /// 清除验证器
                /// </summary>
                //console.log("clearValidation");
            }
        })
        .Class("$pcode.validator.ValidatorClass");
})();