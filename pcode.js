

(function () {
    //version 1.0.1.31
    "use strict";

    window.console || (
        window.console = {
            logDiv: null,
            log: function (val) {
                if (window.$) {
                    if (this.logDiv == null) {
                        this.logDiv = $("<div></div>")
                        //this.logDiv.hide();
                        if ($(document.body).children().size() > 0) {
                            this.logDiv.insertBefore(document.body.firstChild);
                        } else {
                            this.logDiv.appendTo(document.body);
                        }
                        $(window).unload(function () { window.console.logDiv == null; });
                    }
                    var text1 = this.logDiv.text();
                    if (!$pcode.isNullEmpty(text1))
                        text1 += "\n\r";
                    if (window.JSON && $pcode.isObject(val)) {
                        val = JSON.stringify(val);
                    }
                    text1 += val;
                    this.logDiv.text(text1);
                }
            }
        });

    var stringEmpty = "",
        noop = function () { },
        undefined,
        tempObj = {};
    var functionType = typeof (noop);
    var _rootPathReg = /^\/|\:\/\//;


    var cacheManager = {
        cacheList: [],
        checkTimeId: null,
        checkTime: 60 * 1000,
        isInit: false,
        setCache: function (key, data, time) {
            isNaN(time) && (time = 1);
            var dataItem = this.getCacheItem(key);
            if (dataItem) {
                dataItem.time = time;
                dataItem.data = data;
                dataItem.timeout = this.makeTimeout(time);
            } else {
                this.cacheList.push({ key: key, data: data, time: time, timeout: this.makeTimeout(time) });
            }
            this.startCheck();
        },
        getCacheItem: function (key) {
            var item = null;
            var list = this.cacheList;
            for (var i = list.length - 1; i >= 0; i--) {
                item = list[i];
                if (key == item.key) {
                    item.timeout = this.makeTimeout(item.time);
                    return item;
                }
            }
            return null;
        },
        getCache: function (key) {
            var item = this.getCacheItem(key);
            return item ? item.data : null;
        },
        makeTimeout: function (time) {
            var timeNow = new Date();

            var timeout = timeNow.setMinutes(timeNow.getMinutes() + time).valueOf();
            return timeout;
        },
        chechTimeout: function () {
            var item = null;
            var list = this.cacheList;
            var timeNow = new Date().valueOf();
            var newList = [];
            for (var i = 0, len = list.length; i < len; i++) {
                item = list[i];
                //console.log([item.timeout, timeNow, item.timeout > timeNow]);
                if (item.timeout > timeNow)
                    newList.push(item);
            }
            this.cacheList = newList;
            this.endCheck();
            //console.log(this.cacheList);
        },
        startCheck: function () {
            if (this.checkTimeId != null) return;
            if (this.cacheList.length <= 0) return;
            //console.log("start check");
            this.checkTimeId = setInterval(function () { cacheManager.chechTimeout(); }, this.checkTime);
            if (!this.isInit) {
                this.isInit = true;
                if (window.jQuery) {
                    $(window).unload(function () { cacheManager.cacheList = []; cacheManager.endCheck(); cacheManager = null; });
                }
            }
        },
        endCheck: function () {
            if (this.checkTimeId == null) return;
            if (this.cacheList.length > 0) return;
            clearInterval(this.checkTimeId);
            //console.log("end check");
            this.checkTimeId = null;
        }
    };

    //$pcode.formatObject
    var formatObjManager = {
        getFormatReg: function (fmt) {
            var regO = $pcode.getCache(fmt);
            if (regO) {
                return regO;
            }
            regO = this.regExFormatObj(fmt);
            $pcode.setCache(fmt, regO);
            return regO;
        },
        regExFormatObj: function (fmt) {
            var list = [];
            var hasName = [];
            var propnameType = null;
            fmt.replace(/\{\{([\:\>\<])([^\}]*?)\}\}/gi, function (findtext, type, propname) {
                type = $pcode.trim(type);
                propname = $pcode.trim(propname);
                propnameType = type + propname;
                //console.log(propnameType);
                if (!$pcode.isNullEmpty(type)
                 && !$pcode.isNullEmpty(propname)
                 && $pcode.inArray(propnameType, hasName) < 0) {
                    hasName.push(propnameType);
                    list.push({ type: type, propname: propname, findtext: findtext });
                }
            });
            hasName = null;
            //console.log(list);
            return list;
        }
    };

    //$pcode.getDataValue/setDataValue
    var _regGetDataAttrList = /[.\[\]]/g;
    var getDataAttrList = function (name) {
        var list = [];
        var listS = name.split(_regGetDataAttrList);
        var item = null;
        for (var i = 0, len = listS.length; i < len; i++) {
            item = listS[i];
            if (!$pcode.isNullEmpty(item))
                list.push(item);
        }
        listS = list;
        list = [];
        for (var i = 0, len = listS.length; i < len; i++) {
            list.push({ name: listS[i], isArray: !isNaN(listS[i + 1]) });
        }
        return list;
    };

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
                if (!obj.hasOwnProperty(n)) continue;
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
            return ((str1 + stringEmpty).toUpperCase() == (str2 + stringEmpty).toUpperCase());
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
            if (this.isNull(value)) return false;
            return (value instanceof Array ||
                    (!(value instanceof Object) &&
                    (Object.prototype.toString.call((value)) == '[object Array]') ||
                    typeof value.length == 'number' &&
                    typeof value.splice != 'undefined' &&
                    typeof value.propertyIsEnumerable != 'undefined' &&
                    !value.propertyIsEnumerable('splice')));
        },
        sliceArray: function (args, pos, count) {
            isNaN(pos) && (pos = 0);
            isNaN(count) && (count = args.length);
            return Array.prototype.slice.call(args, pos, pos + count);
        },
        isJquery: function (obj) {
            return (obj instanceof window.jQuery);
        },
        escape: function (s) {
            if (this.isNullEmpty(s)) return s;
            s = escape(s);
            s = this.replace(s, "+", "%2B");
            s = this.replace(s, "/", "%2F");
            return s;
        },
        unescape: function (s) {
            if (this.isNullEmpty(s)) return s;
            return unescape(s);
        },
        trim: function (str) {
            return (str + "").replace(/(^\s*)|(\s*$)/g, '');
        },
        trimLeft: function (str) {
            return (str + "").replace(/(^\s*)/g, '');
        },
        trimRigth: function (str) {
            return (str + "").replace(/(\s*$)/g, '');
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
                if (arguments[i])
                    list = list.concat(arguments[i]);
            }
            return list;
        },
        removeArrayItem: function (element, list) {
            var list1 = [];
            var len = list.length;
            for (var i = 0; i < len; i++) {
                if (list[i] != element)
                    list1.push(list[i]);
            }
            return list1;
        },
        makeAutoId: function () {
            //生成维一ID， 只合适一个客户端用
            var time = new Date().valueOf();
            if (time === this.___varTempTime) {
                this.___varTempTimePointer++;
            } else {
                this.___varTempTimePointer = 0;
            }
            this.___varTempTime = time;
            return [time, this.___varTempTimePointer].join('_');
        },
        idBuilder: function (checkcallback, max, min, per) {
            if (!checkcallback) return null;
            max = max || 50;
            min = min || 20;
            per = per || 10;
            var timeId = null;
            var idList = [];
            var makeNewId = function () {
                var ids = [];
                for (var i = 0; i < per; i++) {
                    ids.push($pcode.makeAutoId());
                }
                ids = checkcallback(ids);
                ids && (idList = ids.concat(idList));
                ids = null;
                if (idList.length <= 0) {
                    makeNewId();
                    return;
                }
                if (idList.length < max && timeId == null) {
                    timeId = setTimeout(function () { timeId = null; makeNewId(); }, 1);
                }
            };
            var getId = function () {
                if (idList.length <= 0) {
                    makeNewId();
                    return idList.pop();
                };
                if (idList.length < min) {
                    makeNewId();
                }
                //console.log(idList.length);
                return idList.pop();
            };
            return {
                newId: function () {
                    return getId();
                },
                reset: function () {
                    idList = [];
                },
                clear: function () {
                    checkcallback = idList = getId = getId = null;
                }
            };
        },
        isChildEvent: function (e, parentDom) {
            e = e || window.event;
            var o = e.relatedTarget || e.toElement;
            if (this.isNull(o)) return false;
            while (o.parentNode && o != parentDom) {
                o = o.parentNode;
            }
            if (o == parentDom) {
                return true;
            }
            return false;
        },
        setCache: function (key, data, time) {
            cacheManager.setCache(key, data, time);
            return data;
        },
        getCache: function (key) {
            return cacheManager.getCache(key);
        },
        replace: function (s, str, repl) {
            ///<summary>字串替换, 替换所有匹配内容</summary>

            if (this.isNullEmpty(s) || this.isNullEmpty(str)) return s;
            if (this.isNull(repl)) repl = "";
            s += "";
            while (s.indexOf(str) >= 0) {
                s = s.replace(str, repl);
            }
            return s;
        },
        getParam: function (str, name) {
            if (this.isNullEmpty(str) || this.isNullEmpty(name)) return "";
            var sTemp = new String(str);
            var sRet = sTemp.match(name + "\s*:([^:|;]*)");
            return sRet ? unescape(sRet[1]) : "";
        },
        setParam: function (str, name, value) {
            if (this.isNullEmpty(name)) return str;
            var sTemp = str + "";
            var sRet = sTemp.match(name + "\s*:([^:|;]*)");
            if (sRet)
            { sTemp = sTemp.replace(sRet[0], name + ":" + escape(value)); }
            else
            { sTemp = sTemp + name + ":" + escape(value) + ";"; }
            return sTemp;
        },
        setDataValue: function (data, name, value) {
            if (this.isNullEmpty(name)) return;
            var to = data;
            var item = null;
            if (name.indexOf('.')) {
                var list = getDataAttrList(name);
                //console.log(list);
                var len = list.length - 1;
                var nameItem = null;
                for (var i = 0; i < len; i++) {
                    item = list[i];
                    nameItem = item.name;
                    if (this.isNull(to[nameItem])) {
                        to[nameItem] = item.isArray ? [] : {};
                    }
                    to = to[nameItem];
                    //console.log(nameItem);
                }
                //console.log(list[len])
                to[list[len].name] = value;
            } else {
                data[name] = value;
            }
            to = null;
        },
        getDataValue: function (data, name) {
            if (this.isNullEmpty(name)) return null;
            var to = data;
            var item = null;
            if (name.indexOf('.')) {
                var list = getDataAttrList(name);
                var len = list.length;
                var nameItem = null;
                for (var i = 0; i < len; i++) {
                    item = list[i];
                    nameItem = item.name
                    if (this.isNull(to[nameItem])) {
                        return to[nameItem];
                    }
                    to = to[nameItem];
                }
                return to;
            } else {
                return data[name];
            }
            to = null;
        },
        getSelectText: function (selector) {
            return $(selector).find("option:selected").text();
        },
        each: function (list, param, callback) {
            var temp = {
                value: null,
                index: -1,
                name: "",
                length: 0
            };
            try {
                if (!this.isFunction(param)) {
                    this.extend(temp, param);
                } else {
                    callback = param;
                }
                if (list instanceof jQuery) {
                    list = list.toArray();
                } else if (this.isString(list)) {
                    list = $(list).toArray();
                }
                if (list && list.length)
                    temp.length = list.length;
                for (var n in list) {
                    temp.name = n;
                    temp.value = list[n];
                    temp.index++;
                    if (callback.apply(temp) === false) break;
                }
                return temp;
            } finally {
                //$pcode.clearObject(temp);
                temp = null;
            }
        },
        defaultValue: function (value, defaultValue) {
            return (value || defaultValue);
        },
        defaultProperty: function (value, propertyname, defaultValue) {
            return ((value && value[propertyname]) || defaultValue);
        },
        search: function (list, callback) {
            return this.each(list, { retL: [] }, function () {
                if (callback.apply(this.value) === true) {
                    this.retL.push(this.value);
                }
                this.value = null;
            }).retL;
        },
        searchOne: function (list, callback) {
            return this.each(list, function () {
                if (callback.apply(this.value) === true) {
                    return false;
                }
                this.value = null;
            }).value;
        },
        format: function (fm) {
            if (arguments.length <= 1) return fm;
            //var list = [];
            var reg = "";
            $pcode.linq(arguments).where(function (item, index) { return index > 0; })
                .each(function (item, index) {
                    reg = "{" + index + "}";
                    while (fm.indexOf(reg) >= 0) {
                        fm = fm.replace(reg, item);
                    }
                });
            return fm;
        },
        formatObject: function (fm) {
            if ($pcode.isNullEmpty(fm) || arguments.length <= 1) return fm;
            var regList = formatObjManager.getFormatReg(fm);
            if (regList.length <= 0) return fm;
            var listTemp = [];
            $pcode.linq(arguments).where(function (item, index) { return index > 0; })
                .each(function (item, index) {
                    $pcode.linq(regList).each(function () {
                        var val = $pcode.getDataValue(item, this.propname);
                        if ($pcode.isUndefined(val)) {
                            listTemp.push(this)
                            return;
                        }
                        switch (this.type) {
                            case ">":
                                val = $pcode.htmlEncode(val);
                                break;
                            case "<":
                                val = $pcode.urlEncode(val);
                                break;
                        }
                        fm = $pcode.replace(fm, this.findtext, val);
                    });
                    if (listTemp.length <= 0) return false;
                    regList = listTemp;
                    listTemp = [];
                });
            regList = listTemp = null;
            return fm;
        },
        calcPath: function (url) {
            if (url.indexOf(".") >= 0) {
                var isRoot = _rootPathReg.test(url);
                var pathList = url.split('/');
                var urlList = [];
                var item = "";
                var skip = 0;
                while (!this.isNull(item = pathList.pop())) {
                    if (item == stringEmpty || item == ".") continue;
                    if (item == "..")
                        skip++;
                    else {
                        if (skip > 0) {
                            skip--;
                        } else {
                            urlList.push(item);
                        }
                    }
                }
                if (urlList.length > 0) {
                    url = urlList.reverse().join("/");
                    //console.log(url);
                    return ((isRoot ? "/" : "") + url);
                }
                return (isRoot ? "/" : "");
            }
            url = this.replace(url, "//", "/");
            return url;
        },
        getRelativePath: function (sUrl, sRelative) {
            //getRelativePath("http://www.aaa.com/html/context/aaa.aspx")
            //getRelativePath("/html/context/aaa.aspx")
            //getRelativePath("http://www.aaa.com/html/context/aaa.aspx", "../bbb.aspx")
            //getRelativePath("http://www.aaa.com/html/context/", "../aaa.aspx")
            //getRelativePath("/html/context/", "../aaa.aspx")

            if (this.isNull(sRelative))
                sRelative = "";
            else if (_rootPathReg.test(sRelative)) {
                return this.calcPath(sRelative);
            }

            if (!this.isNullEmpty(sUrl))
                sUrl = sUrl.replace(/^.*?\:\/[\/]+[^\/]+/, "").replace(/[^\/]+$/, "");
            //sUrl = sUrl.replace(/^.*?\:\/\/[^\/]+/, "").replace(/[^\/]+$/, "");

            if (!/\/$/.test(sUrl)) { sUrl += "/"; }

            //console.log(sUrl);

            var url = sUrl + sRelative;
            //console.log([sUrl, sRelative, url]);
            url = this.calcPath(url);
            return url;
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
                success: function (data) { if (successCall) successCall(JSON.parse(data)); },
                error: errorCall
            });
        },
        getJSONsyncs: function (url, datas) {
            var json = null;
            this.getJSON(url, datas, function (resources) {
                json = resources;
            }, null, "GET", false);
            return json;
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
            var data = null;
            this.get(url, datas, function (resources) {
                data = resources;
            }, null, false);
            return data;
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
            var dataR = "";
            this.post(url, datas, function (data) {
                dataR = data;
            }, null, false, dataType);
            return dataR;
        },
        imagePreload: function (src, onload) {
            if (this.isNullEmpty(src)) return;
            setTimeout(function () {
                var imgO = new Image();
                if (!$pcode.isNull(onload))
                    imgO.onload = onload;
                imgO.src = src;
            }, 0);
        },
        htmlEncode: function (str) {
            var jo = $('#ps_htmlEncode_div20111228');
            if (jo.size() <= 0) {
                jo = $('<div id="ps_htmlEncode_div20111228" style="display:none"></div>').appendTo(document.body);
            }
            str = this.replace(str, "\r", "&rrrr;");
            str = this.replace(str, "\n", "&nnnn;");
            jo.text(str);
            str = jo.html();
            return str;
        },
        htmlDecode: function (str) {
            var jo = $('#ps_htmlEncode_div20111228');
            if (jo.size() <= 0) {
                jo = $('<div id="ps_htmlEncode_div20111228" style="display:none"></div>').appendTo(document.body);
            }
            jo.html(str);
            var hs = jo.text();
            hs = this.replace(hs, "&nnnn;", "\n");
            hs = this.replace(hs, "&rrrr;", "\r");
            return hs;
        },
        urlEncode: function (str) {
            return encodeURI(str);
        },
        urlDecode: function (str) {
            return decodeURI(str);
        },
        getQueryString: function (url, item) {
            var sValue;
            if (item == "QUERY_STRING")
                sValue = url.match(new RegExp("[\?](.*)", "i"));
            else
                sValue = url.match(new RegExp("[\?\&]" + item + "=([^\&#]*)([\&#]?)", "i"));
            url = null, item = null;
            return sValue ? sValue[1] : "";
        },
        queryString: function (item) {
            var str = this.getQueryString((window.location + ""), item);
            if (!this.isNullEmpty(str))
                return this.urlDecode(str);
            else
                return str;
        },
        removeRQItem: function (url, item) {
            if (this.isNullEmpty(url)) url = this.queryString("QUERY_STRING");
            var _sT = item + "=" + this.getQueryString(url, item);
            url = url.replace(new RegExp("(?:[\&]" + _sT + ")", "i"), "");
            if (url.indexOf("&") >= 0)
                url = url.replace(new RegExp("(?:[\?]" + _sT + ")", "i"), "\?");
            else
                url = url.replace(new RegExp("(?:[\?]" + _sT + ")", "i"), "");
            item = null;
            return url;
        },
        setQueryString: function (url, name, value) {
            if (this.isNullEmpty(name)) return url;
            if (this.isNullEmpty(value)) value = "";
            if (this.isNullEmpty(url)) {
                return ("?" + name + "=" + this.urlEncode(value));
            }
            var sTemp = url;
            sTemp = this.removeRQItem(sTemp, name);
            if (sTemp.indexOf("?") >= 0) {
                sTemp = (sTemp + "&" + name + "=" + this.urlEncode(value));
                sTemp = sTemp.replace("?&", "?");
            }
            else
                sTemp = (sTemp + "?" + name + "=" + this.urlEncode(value));
            return sTemp;
        },
        makeUrlAndQueryString: function (url) {
            var qs = $pcode.queryString("QUERY_STRING");
            if (this.isNullEmpty(url)) {
                return ("?" + qs);
            }
            if (url.indexOf("?") >= 0) {
                url += ("&" + qs);
            } else {
                url += ("?" + qs);
            }
            return url;
        },
        guid: function (_type) {
            var fsRet = "";
            var fsTemp = "";
            for (var i = 1; i <= 32; i++) {
                fsTemp = Math.round(Math.random() * 15.0).toString(16);
                fsRet += fsTemp;
                if ((i == 8) || (i == 12) || (i == 16) || (i == 20))
                    fsRet += "-";
            }
            if (!this.isNull(_type)) _type = (_type + "").toUpperCase();
            switch (_type) {
                case "N":
                    fsRet = fsRet.replace(/-/gi, '');
                    break;
                case "B":
                    fsRet = "{" + fsRet + "}";
                    break;
                case "P":
                    fsRet = "(" + fsRet + ")";
                    break;
            }
            return fsRet;
        },
        getDate: function (format) {
            var str = format;
            if (this.isNullEmpty(str)) {
                str = "yyyy-MM-dd";
            }
            var date = new Date();

            var Week = ['日', '一', '二', '三', '四', '五', '六'];
            str = str.replace(/yyyy|YYYY/, date.getFullYear());
            str = str.replace(/yy|YY/, (date.getYear() % 100) > 9 ? (date.getYear() % 100).toString() : '0' + (date.getYear() % 100));
            str = str.replace(/MM/, date.getMonth() > 9 ? date.getMonth().toString() : '0' + date.getMonth());
            str = str.replace(/M/g, date.getMonth());
            str = str.replace(/w|W/g, Week[date.getDay()]);
            str = str.replace(/dd|DD/, date.getDate() > 9 ? date.getDate().toString() : '0' + date.getDate());
            str = str.replace(/d|D/g, date.getDate());
            str = str.replace(/hh|HH/, date.getHours() > 9 ? date.getHours().toString() : '0' + date.getHours());
            str = str.replace(/h|H/g, date.getHours());
            str = str.replace(/mm/, date.getMinutes() > 9 ? date.getMinutes().toString() : '0' + date.getMinutes());
            str = str.replace(/m/g, date.getMinutes());
            str = str.replace(/ss|SS/, date.getSeconds() > 9 ? date.getSeconds().toString() : '0' + date.getSeconds());
            str = str.replace(/s|S/g, date.getSeconds());
            return str;
        },
        getNow: function () {
            var tDate = new Date();
            var tstrVal = "" + tDate.getFullYear() + "-" + (tDate.getMonth() + 1) + "-" + tDate.getDate() + " " + tDate.getHours() + ":" + tDate.getMinutes() + ":" + tDate.getSeconds();
            tDate = null;
            return tstrVal;
        },
        getTime: function () {
            var tDate = new Date();
            var tstrVal = "" + tDate.getHours() + ":" + tDate.getMinutes() + ":" + tDate.getSeconds();
            tDate = null;
            return tstrVal;
        },
        getMousePosition: function (e) {
            e = e || window.event;
            var x = e.pageX || (e.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft));
            var y = e.pageY || (e.clientY + (document.documentElement.scrollTop || document.body.scrollTop));
            e = null;
            return { 'left': x, 'top': y };
        },
        getEventKeycode: function (e) {
            return e ? ((e.which) ? e.which : e.keyCode) : 0;
        },
        getEventTarget: function (e) {
            return e ? (e.srcElement || e.target) : null;
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
            //$.cookie("lLC", "1", { expires: 100 });时间(天)
            if (typeof value != 'undefined') { // name and value given, set cookie
                options = options || {};
                if (value === null) {
                    value = '';
                    options.expires = -1;
                }
                var expires = '';
                if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
                    var date;
                    if (typeof options.expires == 'number') {
                        date = new Date();
                        date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
                    } else {
                        date = options.expires;
                    }
                    expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
                }
                var path = options.path ? '; path=' + options.path : '';
                var domain = options.domain ? '; domain=' + options.domain : '';
                var secure = options.secure ? '; secure' : '';
                document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
            } else { // only name given, get cookie
                var cookieValue = null;
                if (document.cookie && document.cookie != '') {
                    var cookies = document.cookie.split(';');
                    for (var i = 0; i < cookies.length; i++) {
                        var cookie = $.trim(cookies[i]);
                        // Does this cookie string begin with the name we want?
                        if (cookie.substring(0, name.length + 1) == (name + '=')) {
                            cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                            break;
                        }
                    }
                }
                return cookieValue;
            }
        },
        extend: function (obj) {
            var len = arguments.length;
            if (len <= 0) return obj;
            if (len <= 1) {
                for (var n0 in obj) {
                    this[n0] = obj[n0];
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
    //version 1.0.1.31
    "use strict";
    var $pcode = window.$pcode;

    //环境类, 帮助解决闭包内存释放问题
    $pcode.extend({
        env: function () {
            //建立一个环境, 此方法已经过时, 不要使用
            if (arguments.length <= 0) return null;
            var v = new $pcode.env.EnvClass();
            $pcode.env.addEnvrn(v);
            try {
                if ($pcode.isFunction(arguments[0])) {
                    arguments[0].apply(v);
                } else if (!$pcode.isNull(arguments[0])) {
                    $pcode.extend(v, arguments[0]);
                    arguments[1].apply(v);
                }
                return v;
            } finally {
                v = null;
            }
        },
        temp: function () {
            //建立一个临时环境, 不自动建立环境链
            //return $env.apply(this, arguments).removeMeToParent_ps_20120101_t().clear_ps_20120101_t();
            if (arguments.length <= 0) return null;
            var v = new $pcode.env.EnvClass();
            try {
                if ($pcode.isFunction(arguments[0])) {
                    arguments[0].apply(v);
                } else if (!$pcode.isNull(arguments[0])) {
                    $pcode.extend(v, arguments[0]);
                    arguments[1].apply(v);
                }
                return v;
            } finally {
                setTimeout(function () {
                    $pcode.env.clearEnv.apply(v);
                    v = null;
                }, 0);
            }
        }
    });

    $pcode.extend($pcode.env, {
        EnvClass: function () { this.id = $pcode.makeAutoId(); this.onClearFunList_ps_20120101_t = []; },
        clearEnv: function () {
            if (!this.onClearFunList_ps_20120101_t) return;
            if (this.onClearFunList_ps_20120101_t.length > 0) {
                //处理clear事件
                this.onClearFunList_ps_20120101_t.reverse();
                var onClear = null;
                while (onClear = this.onClearFunList_ps_20120101_t.pop()) {
                    onClear.apply(this);
                }
                onClear = null;
            }

            for (var n in this) {
                this[n] = null;
                delete this[n];
            }
        },
        envList: [],
        addEnvrn: function (env) {
            this.envList.push(env);
        },
        removeEnvrn: function (env) {
            this.envList = $pcode.removeArrayItem(env, this.envList);
            //console.log(["_envList", _envList]);
            env = null;
        },
        unload: function () {
            var _envList = $pcode.env.envList;
            if (_envList.length > 0) {
                var env = null;
                _envList.reverse();
                while (env = _envList.pop()) {
                    $pcode.env.clearEnv.apply(env);
                }
                env = null;
            }
            _envList = null;
        }
    });

    $pcode.extend($pcode.env.EnvClass.prototype, {
        onClearFunList_ps_20120101_t: [],
        isEnvObj: true,
        clear: function () {
            if (arguments[0]) {
                if (arguments[0].isEnvObj === true) {
                    var $this = this;
                    arguments[0].onClearFunList_ps_20120101_t.push(function () {
                        try { $pcode.env.clearEnv.apply($this); } finally { $this = null; }
                    });
                } else if ($pcode.isFunction(arguments[0])) {
                    this.onClearFunList_ps_20120101_t.push(arguments[0]);
                } else {
                    //clearByJQuery.addEnv(this, arguments[0]);
                    var $thisJ = this;
                    $pcode.linkToDom(arguments[0], function () {
                        $pcode.env.removeEnvrn($thisJ);
                        $pcode.env.clearEnv.apply($thisJ);
                    });
                    //$pcode.env.clearEnv.apply(env);
                }
            } else {
                $pcode.env.removeEnvrn($thisJ);
                $pcode.env.clearEnv.apply($thisJ);
            }
            return this;
        }
    });

    $(window).unload(function () {
        $pcode.env.unload();
    });

})();

(function () {
    //version 1.0.1.31
    "use strict";
    var $pcode = window.$pcode;

    var doc = window.document;
    var head = doc.head ||
      doc.getElementsByTagName('head')[0] ||
      doc.documentElement;
    var baseElement = head.getElementsByTagName('base')[0];

    var IS_CSS_RE = /\.css(?:\?|$)/i;
    var READY_STATE_RE = /loaded|complete|undefined/;

    $pcode.extend({
        importJS: function (path, filelist, callback) {
            if ($pcode.isNullEmpty(path))
                return;

            if (path.indexOf("/") < 0) {
                var nM130111 = $pcode.importJS.scriptNodeManager;
                var jsnode130111 = nM130111.getJsNode(path);
                var path130111 = nM130111.getJsFilePath(jsnode130111);
                path = $pcode.getRelativePath(path130111, path);
                nM130111 = jsnode130111 = path130111 = null;
                //console.log(path);
            } else {
                path = mapPath(path);
            }

            var jsM = $pcode.importJS.JSManager;

            jsM.addFile(path, $pcode.stringEmpty);
            var fileData = jsM.getJsfileData(path);
            path = fileData.jsfile;

            var needFiles = [];
            $pcode.each(filelist, function () {
                //处理所有参数
                if ($pcode.isArray(this.value)) {
                    //如果是list
                    $pcode.each(this.value, function () {
                        this.value = $pcode.importJS.mapPath(path, this.value);
                        needFiles.push(this.value);
                    });
                } else {
                    this.value = $pcode.importJS.mapPath(path, this.value);
                    needFiles.push(this.value);
                }
            });

            if (fileData.status == jsM.JSSTATUS.loading || fileData.status == jsM.JSSTATUS.add) {
                fileData.needJs = needFiles;
                if (needFiles.length <= 0) {
                    fileData.status = jsM.JSSTATUS.doned;
                    callback && callback(fileData.jsfile);
                } else {
                    fileData.status = jsM.JSSTATUS.loaded;
                    fileData.callback = callback;

                    $pcode.each(needFiles, function () {
                        //处理所有参数
                        var data = jsM.addFile(this.value, $pcode.stringEmpty);
                        if ($pcode.isNullEmpty(data.status) || data.status == jsM.JSSTATUS.add) {
                            data.status = jsM.JSSTATUS.loading;
                            //config.classfile
                            if (_importJSConfig.fetch || _importJSConfig.classfile == this.value) {
                                //如果要加载
                                $pcode.importJS.fetch(this.value, $pcode.importJS.fetchHandle);
                            } else {
                                //如果不要加载, 用于合并js
                                var url = this.value;
                                setTimeout(function () {
                                    $pcode.importJS.JSManager.makeJsFileStatusLoaded(url);
                                    $pcode.importJS.JSManager.checkJsfileDone();
                                    //callback && callback(url);
                                }, 1);
                            }
                        }
                    });
                }
            }

            jsM = fileData = needFiles = filelist = callback = null;
        },
        usingJS: function (classname, usingclasslist, callback) {
            //var path = $pcode.importJS.JSManager.makeClassFile($pcode.stringEmpty, classname);

            var fileData = $pcode.importJS.JSManager.getJsfileDataByClassname(classname);
            if ($pcode.isNull(fileData)) {
                return;
            }
            var path = fileData.jsfile; //取得classname文件路径
            var pathModule = path.substr(0, path.length - (classname.length + 3)); //取得模块路径
            //console.log(pathModule);
            var list = [];
            $pcode.each(usingclasslist, { classpath: $pcode.stringEmpty, jsM: $pcode.importJS.JSManager }, function () {
                this.classpath = this.jsM.makeClassFile(pathModule, this.value);
                this.jsM.addFile(this.classpath, this.jsM.getClassnameOnly(this.value));
                list.push(this.classpath);
            });
            this.importJS(path, list, callback);
            usingclasslist = callback = list = null;
        }
    });

    $pcode.extend($pcode.usingJS, {
        isFile: function (usingclassname) {
            return (usingclassname.toUpperCase().indexOf("FILE:") == 0);
        }

    });

    var mapPath = function (path) {
        if ($pcode.isNullEmpty(path) || path.indexOf("%") < 0) return path;
        var pathRegx = path.match(/%([^%]*)%/i);
        var pathReturn = "";
        var pathConfig = _importJSConfig.path;
        if (pathRegx) {
            if (pathConfig[pathRegx[1]])
                pathReturn = mapPath(path.replace(pathRegx[0], pathConfig[pathRegx[1]]));
            else
                pathReturn = mapPath(path.replace(pathRegx[0], $pcode.stringEmpty));
        }
        pathRegx = null;
        pathConfig = null;
        return pathReturn;
    };

    $pcode.extend($pcode.importJS, {
        config: {
            jqurey: "%libpath%/jquery.js",
            importfilename: "pcode.js",
            classfile: "",
            debug: true,
            fetch: true,
            version: "1.0.0.0",
            path: {//这里可以设置路径, 用于%path%支持
                libpath: ""
            }
        },
        JSManager: {
            JSSTATUS: { add: "add", loading: "loading", loaded: "loaded", doned: "doned" },
            jsFileList: [], //[{ classname: "", jsfile: "", needJs:[], callback:null, status: ""}]//一个文件一个类
            //jsClassList: [], //[{ classname: "", jsfile: "", status: ""}]
            addFile: function (jsFile, classname) {
                if (!$pcode.isNullEmpty(jsFile)) {
                    var data = this.getJsfileData(jsFile);
                    if ($pcode.isNull(data)) {
                        var data = { jsfile: jsFile, classname: classname, needJs: [], callback: $pcode.noop, status: this.JSSTATUS.add };
                        this.jsFileList.push(data);
                        return data;
                    }
                    return data;
                }
                return {};
            },
            hasJsFile: function (jsFile) {
                return !$pcode.isNull(this.getJsfileData(jsFile));
            },
            getJsfileData: function (jsfile) {
                return $pcode.searchOne(this.jsFileList, function () {
                    return this.jsfile == jsfile;
                });
            },
            getJsfileDataByClassname: function (classname) {
                return $pcode.searchOne(this.jsFileList, function () { return this.classname == classname; });
            },
            makeJsFileStatusLoaded: function (jsfile) {
                $pcode.each(this.jsFileList, { jsM: this }, function () {
                    if (this.value.jsfile == jsfile) {
                        if (this.value.status == this.jsM.JSSTATUS.loading || this.value.status == this.jsM.JSSTATUS.add)
                            this.value.status = this.jsM.JSSTATUS.loaded;
                        return false;
                    }
                });
            },
            canJsfileDone: function (fileData) {
                if (fileData.status != this.JSSTATUS.loaded) {
                    return false;
                }
                if (fileData.needJs.length <= 0) return true;
                var jsfileT = fileData.jsfile;
                //如果引用本身和循环引用
                return $pcode.each(fileData.needJs, { ok: true }, function () {
                    //(this.value == jsfileT)   //引用本身
                    var ok = (this.value == jsfileT) || $pcode.each($pcode.importJS.JSManager.jsFileList, { jsfile: this.value, doned: false }, function () {
                        if (this.value.jsfile == this.jsfile) {
                            //$pcode.inArray(jsfileT, this.value.needJs) >= 0   //循环引用
                            if ($pcode.inArray(jsfileT, this.value.needJs) >= 0 || this.value.status == $pcode.importJS.JSManager.JSSTATUS.doned) {
                                this.doned = true;
                            }
                            return false;
                        }
                    }).doned;
                    if (!ok) {
                        this.ok = false;
                        return false;
                    }
                }).ok;
            },
            checkJsfileDone: function () {
                $pcode.each(this.jsFileList, { jsM: this }, function () {
                    if (this.value.status == this.jsM.JSSTATUS.loaded) {
                        //this.value.status = this.jsM.JSSTATUS.loaded;

                        if (this.jsM.canJsfileDone(this.value)) {
                            if (this.value.callback) {
                                this.value.status = this.jsM.JSSTATUS.doned;
                                this.value.callback(this.value.jsfile);
                                this.value.callback = $pcode.noop;
                                this.jsM.checkJsfileDone();
                            }
                        }
                    }
                });
            },
            isFile: function (usingclassname) {
                return (usingclassname.toUpperCase().indexOf("FILE:") == 0);
            },
            makeClassFile: function (path, classname) {
                if ($pcode.isNullEmpty(classname)) return $pcode.stringEmpty;
                if (this.isFile(classname)) {
                    return $pcode.getRelativePath(path, classname.substr(5, classname.length - 5));
                }
                var url = $pcode.stringEmpty;
                var urlPers = classname.split('/');
                urlPers[urlPers.length - 1] = $pcode.replace(urlPers[urlPers.length - 1], ".", "/");
                var a = [];
                url = urlPers.join("/") + ".js";
                url = $pcode.importJS.mapPath(path, url);
                //url = $pcode.getRelativePath(path, url);
                return url;
            },
            getClassnameOnly: function (classname) {
                var classL = classname.split('/');
                classname = classL[classL.length - 1]; //取得类名, 原因参数里有路径(./Class.Myclass)
                classL = null;
                return classname;
            }
        },
        fetchHandle: function (node) {
            if (node && !$pcode.isNullEmpty(node.importurl)) {
                var url = node.importurl;
                var callback = null; // node.importcallback;
                node = undefined;
                setTimeout(function () {
                    $pcode.importJS.JSManager.makeJsFileStatusLoaded(url);
                    $pcode.importJS.JSManager.checkJsfileDone();
                    //callback && callback(url);
                    callback = url = null;
                }, 1);
            }
            node = undefined;
        },
        mapPath: function (path, file) {
            file = mapPath(file);
            path = $pcode.getRelativePath(path, file);
            //var path = $pcode.calcPath(mapPath(path));
            return path;
        },
        //加载资源文件文件
        fetch: function (url, callback, callback2, charset) {
            //获取的文件是不是css
            var isCSS = IS_CSS_RE.test(url);

            //如果是css创建节点 link  否则 则创建script节点
            var node = document.createElement(isCSS ? 'link' : 'script');
            node.importurl = url;
            //node.importcallback = callback2;
            callback2 = null;

            if (charset) {
                var cs = $pcode.isFunction(charset) ? charset(url) : charset;
                cs && (node.charset = cs);
            }

            //assets执行完毕后执行callback ，如果自定义callback为空，则赋予noop 为空函数
            assetOnload(node, callback || $pcode.noop);

            //如果是样式 ……  如果是 脚本 …… async 详见：https://github.com/seajs/seajs/issues/287
            if (isCSS) {
                node.rel = 'stylesheet';
                node.href = url;
            }
            else {
                node.async = 'async';
                node.src = url;
            }

            // For some cache cases in IE 6-9, the script executes IMMEDIATELY after
            // the end of the insertBefore execution, so use `currentlyAddingScript`
            // to hold current node, for deriving url in `define`.
            // 之下这些代码都是为了兼容ie 
            // 假如A页面在含有base标签，此时A页面有个按钮具有请求B页面的功能，并且请求过来的内容将插入到A页面的某个div中
            // B页面有一些div，并且包含一个可执行的script
            // 其他浏览器都会在异步请求完毕插入页面后执行该script 但是 ie 不行，必须要插入到base标签前。
            //currentlyAddingScript = node;

            // ref: #185 & http://dev.jquery.com/ticket/2709 
            // 关于base 标签 http://www.w3schools.com/tags/tag_base.asp

            baseElement ?
                head.insertBefore(node, baseElement) :
                head.appendChild(node);

            //currentlyAddingScript = null;
        },
        // 创建样式节点
        importStyle: function (cssText, id) {
            // Don't add multi times 
            //一个id不要添加多次 如果页面中已经存在该id则直接返回
            if (id && doc.getElementById(id)) return;

            //创建style标签，并指定标签id，并插入head，ie和其他标准浏览器插入css样式存在兼容性问题，具体如下：
            var element = doc.createElement('style');
            id && (element.id = id);

            // Adds to DOM first to avoid the css hack invalid
            head.appendChild(element);

            // IE
            if (element.styleSheet) {
                element.styleSheet.cssText = cssText;
            }
            // W3C
            else {
                element.appendChild(doc.createTextNode(cssText));
            }
            element = null;
        }
    });

    var _importJSConfig = $pcode.importJS.config;

    //资源文件加载完毕后执行回调callback
    function assetOnload(node, callback) {
        if (node.nodeName === 'SCRIPT') {
            scriptOnload(node, callback);
        } else {
            styleOnload(node, callback);
        }
        node = callback = null;
    }

    //资源文件加载完执行回调不是所有浏览器都支持一种形式，存在兼容性问题
    //http://www.fantxi.com/blog/archives/load-css-js-callback/ 这篇文章非常不错

    //加载脚本完毕后执行回调
    function scriptOnload(node, callback) {

        // onload为IE6-9/OP下创建CSS的时候，或IE9/OP/FF/Webkit下创建JS的时候  
        // onreadystatechange为IE6-9/OP下创建CSS或JS的时候

        node.onload = node.onerror = node.onreadystatechange = function () {

            //正则匹配node的状态
            //readyState == "loaded" 为IE/OP下创建JS的时候
            //readyState == "complete" 为IE下创建CSS的时候 -》在js中做这个正则判断略显多余
            //readyState == "undefined" 为除此之外浏览器
            if (READY_STATE_RE.test(node.readyState)) {

                // Ensure only run once and handle memory leak in IE
                // 配合 node = undefined 使用 主要用来确保其只被执行一次 并 处理了IE 可能会导致的内存泄露
                node.onload = node.onerror = node.onreadystatechange = null;

                // Remove the script to reduce memory leak
                // 在存在父节点并出于非debug模式下移除node节点
                if (node.parentNode && !_importJSConfig.debug) {
                    head.removeChild(node);
                }

                //执行回调
                callback(node);


                // Dereference the node
                // 废弃节点，这个做法其实有点巧妙，对于某些浏览器可能同时支持onload或者onreadystatechange的情况，只要支持其中一种并执行完一次之后，把node释放，巧妙实现了可能会触发多次回调的情况
                node = undefined;
                callback = null;
            }
        };

    }

    //加载样式完毕后执行回调
    function styleOnload(node, callback) {

        // for Old WebKit and Old Firefox
        // iOS 5.1.1 还属于old --！ 但是 iOS6中 536.13
        // 这里用户采用了代理可能会造成一点的勿扰，可能代理中他是一个oldwebkit浏览器 但是实质却不是
        if (isOldWebKit || isOldFirefox) {
            //$pcode.importJS.log('Start poll to fetch css');

            setTimeout(function () {
                poll(node, callback);
                node = callback = null;
            }, 1); // Begin after node insertion 
            // 延迟执行 poll 方法，确保node节点已被插入
        }
        else {
            node.onload = node.onerror = function () {
                node.onload = node.onerror = null;
                node = undefined;
                callback(node);
                callback = null;
            };
        }

    }

    function poll(node, callback) {
        var isLoaded = false;

        // for WebKit < 536
        // 如果webkit内核版本低于536则通过判断node节点时候含属性sheet
        if (isOldWebKit) {
            if (node['sheet']) {
                isLoaded = true;
            }
        }
        // for Firefox < 9.0
        else if (node['sheet']) {
            try {
                //如果存在cssRules属性
                if (node['sheet'].cssRules) {
                    isLoaded = true;
                }
            } catch (ex) {
                // The value of `ex.name` is changed from
                // 'NS_ERROR_DOM_SECURITY_ERR' to 'SecurityError' since Firefox 13.0
                // But Firefox is less than 9.0 in here, So it is ok to just rely on
                // 'NS_ERROR_DOM_SECURITY_ERR'

                // 在Firefox13.0开始把'NS_ERROR_DOM_SECURITY_ERR'改成了'SecurityError'
                // 但是这边处理是小于等于firefox9.0的所以在异常处理上还是依赖与'NS_ERROR_DOM_SECURITY_ERR'
                if (ex.name === 'NS_ERROR_DOM_SECURITY_ERR') {
                    isLoaded = true;
                }
            }
        }

        setTimeout(function () {
            if (isLoaded) {
                // Place callback in here due to giving time for style rendering.
                callback(node);
            } else {
                poll(node, callback);
            }
            node = callback = null;
        }, 1);
    }

    //获取 UA 信息
    var UA = navigator.userAgent;

    // `onload` event is supported in WebKit since 535.23
    // Ref:
    //  - https://bugs.webkit.org/show_activity.cgi?id=38995
    // css onload 事件的支持 从webkit 内核版本 535.23 开始
    var isOldWebKit = Number(UA.replace(/.*AppleWebKit\/(\d+)\..*/, '$1')) < 536;

    // `onload/onerror` event is supported since Firefox 9.0
    // onload/onerror 这个事件是从firefox9.0开始支持的，在判断中首先判断UA是否是Firefox 并且 在存在onload
    // Ref:
    //  - https://bugzilla.mozilla.org/show_bug.cgi?id=185236
    //  - https://developer.mozilla.org/en/HTML/Element/link#Stylesheet_load_events
    var isOldFirefox = UA.indexOf('Firefox') > 0 &&
      !('onload' in document.createElement('link'));


    var jqueryManager = {
        loadResources: function (url, callback, async) {
            if (async !== false) async = true;
            var xhr = $pcode.createXHR();
            if (xhr) {
                xhr.onreadystatechange = function () {
                    if (xhr.readyState == 4) {
                        //xhr.onreadystatechange = undefined;;
                        if (xhr.status == 200 || xhr.status == 304 || xhr.status == 0) {
                            callback(xhr.responseText);
                        }
                        else {
                            alert('XML request error: ' + xhr.statusText + ' (' + xhr.status + '): ' + url);
                        }
                        try { xhr.onreadystatechange = null; } catch (e) { };
                        callback = null;
                        xhr = undefined;
                    }
                };
                if (_importJSConfig.debug) {
                    url = $pcode.setQueryString(url, "debRandID", new Date().valueOf());
                }
                xhr.open('GET', url, async);
                xhr.send(null);
            }
        },
        load: function (url) {
            //scriptManager.scriptList.push(url);
            this.loadResources(url, function (jsText) {
                try {
                    var oScript = document.createElement("script");
                    oScript.type = "text/javascript";
                    oScript.text = jsText;
                    head.appendChild(oScript);
                    //_head.insertBefore(_head.firstChild, oScript);
                    oScript = null;
                    url = null;
                } finally {
                    $pcode.importJS.JSManager.addFile(url, $pcode.stringEmpty).status = $pcode.importJS.JSManager.JSSTATUS.loaded;
                }
            }, false);
        }
    };

    var _rootPathReg = /^\/|\:\/\//;
    $pcode.importJS.scriptNodeManager = {};
    $pcode.extend($pcode.importJS.scriptNodeManager, {
        getJsNode: function (jsName) {
            var js = document.scripts;
            for (var i = js.length; i > 0; i--) {
                if (js[i - 1].src.indexOf(jsName) > -1) {
                    return js[i - 1];
                }
            }
            js = null;
            return null;
        },
        getJsFilePath: function (jsNode) {
            if ($pcode.isNull(jsNode)) return $pcode.stringEmpty;
            var jsPath = jsNode.src;
            if (!_rootPathReg.test(jsPath)) {
                jsPath = $pcode.getRelativePath(window.location + "", jsPath);
                jsPath = $pcode.getRelativePath(jsPath);
            } else {
                //console.log(jsPath);
                jsPath = $pcode.getRelativePath(jsPath);
            }
            return jsPath;
        },
        getCodefileByScript: function (jsNode) {
            if ($pcode.isNull(jsNode)) return $pcode.stringEmpty;
            return jsNode.getAttribute("classfile")
        },
        getImportVersion: function (jsNode) {
            if ($pcode.isNull(jsNode)) return $pcode.stringEmpty;
            return $pcode.getQueryString(jsNode.src, "version");
        }
    });

    $pcode.extend({
        loadJS: function (url) {
            jqueryManager.load(url);
        }
    });


    (function () {
        var config = _importJSConfig;
        config.jqurey = "http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.8.3.js"; // "%libpath%/jquery.js";
        config.importfilename = "pcode.js";
        config.fetch = true;//是否加载, 用于合并js

        var scriptNodeManager = $pcode.importJS.scriptNodeManager;
        var importfilename = config.importfilename;
        var jsNode = scriptNodeManager.getJsNode(importfilename);
        if (!jsNode) {
            config.importfilename = "pcode.js";
            importfilename = config.importfilename;
            jsNode = scriptNodeManager.getJsNode(importfilename);
        }

        config.path.libpath = scriptNodeManager.getJsFilePath(jsNode);
        var importfile = $pcode.importJS.mapPath(config.path.libpath, config.importfilename);
        config.jqurey = $pcode.importJS.mapPath(importfile, config.jqurey);
        if (!window.jQuery) {
            jqueryManager.load(config.jqurey);
            //console.log("load jQuery");
        }
        config.version = scriptNodeManager.getImportVersion(jsNode);


        var classfile = scriptNodeManager.getCodefileByScript(jsNode);

        var jsM = $pcode.importJS.JSManager;
        var classpath = jsM.makeClassFile(window.location + "", classfile);

        config.classfile = classfile;

        //console.log([config, $pcode.importJS.JSManager, jQuery, importfile, config.classfile]);
        if (!$pcode.isNullEmpty(classfile)) {

            var classnameOnly = jsM.getClassnameOnly(classfile);
            jsM.addFile(classpath, classnameOnly);
            config.classfile = classpath; //计算后的classfile
            //console.log(config.classfile);
            //var classpath = $pcode.importJS.mapPath(importfile);
            //jsM.addFile($pcode.m
            $.holdReady(true);
            $pcode.importJS(importfile, [classpath], function () {
                //console.log("import End");
                $(function () {
                    var classDef = $pcode.Class.getClassDefine(classnameOnly);
                    //console.log([classnameOnly, classpath, classDef]);
                    if (classDef) {
                        var ot = null;
                        try {
                            ot = new classDef();
                            if (ot.onPageLoad) {
                                ot.onPageLoad();
                            }
                            if (ot.onPageUnload) {
                                $(window).unload(function () { ot.onPageUnload(); ot = null; });
                            }
                        } finally {
                            if (ot && !ot.onPageUnload)
                                ot = null;
                            classDef = null;
                        }
                    }
                });
                $.holdReady(false);
            });
        }

        jsM = config = jsNode = null;
    })();
})();



(function () {
    //version 1.1.2.1
    "use strict";
    var $pcode = window.$pcode;

    $pcode.extend({
        Class: function (className, usinglist, callback) {
            $pcode.usingJS(className, usinglist, function (jsfile) {
                if (callback)
                    $pcode.Class.classDefine(className, callback(jsfile), jsfile);
            });
        }
    });

    $pcode.extend($pcode.Class, {
        classDefine: function (className, classDefine, jsfile) {
            var def = this.makeClassDefine(className);
            //console.log(className);
            classDefine["$classname"] = className;
            $pcode.Class.Define(classDefine, def);
            def.jsfile = jsfile;
            if (classDefine.Static) {
                //处理Static静态
                $pcode.extend(def, classDefine.Static);
                //delete classDefine.Static;
                if ($pcode.isFunction(def.init))
                    def.init();
            }
            def.prototype = classDefine;
            def.constructor = classDefine;
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
                        ot[n] = new Function("$pcode.Class.ResetObject(this); this.Static = " + className + "; if (this.init) this.init.apply(this, arguments);");
                    ot = ot[n];
                }
            }
            if (ot[list[len]]) return ot[list[len]];
            return ot[list[len]] = new Function("$pcode.Class.ResetObject(this); this.Static = " + className + "; if (this.init) this.init.apply(this, arguments);");
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
            resetObjectAttribute(obj);
        },
        Define: function (objDefine, def) {
            //定义过滤, 和简单分离
            if (objDefine["extend"]) {
                //console.log([objDefine["$classname"], objDefine["extend"]]);
                //处理extend, 可以是数组
                makeDefineAttribute(objDefine, objDefine["extend"]);
            }
            makeDefineisConstructorOfFun(objDefine, def);
            makeDefineDisposeFun(objDefine);
            //console.log(getGroupList(objDefine));
            def = null;
        }
    });

    var _getBaseDefine = function (extend, pos) {
        if (!extend || isNaN(pos) || pos < 0 || pos >= extend.length)
            throw new Error("None Defined Base Extends: " + methodname);

        return extend[pos].prototype;
    },
    _runBaseFun = function (objDefine, methodname, pos, args) {
        //var $extendTemp = this.$runtimes.$extendTemp;
        var extendTemp = null;
        try {
            extendTemp = this.isConstructorOf.extend;
            var baseDefine = _getBaseDefine(this.isConstructorOf.extend, pos);
            if (!baseDefine || !baseDefine[methodname])
                throw new Error("None Defined Base Methods: " + methodname);
            this.isConstructorOf.extend = baseDefine.isConstructorOf.extend;
            return baseDefine[methodname].apply(this, args);
        } finally {
            this.isConstructorOf.extend = extendTemp;
            extendTemp = null;
        }
    };

    var makeDefineAttribute = function (objDefine, extendList) {
        //合并extend定义
        var list = $pcode.mergeArray(extendList);

        var t = null;
        var extend = null;
        var len = list.length;
        var groupList = null;
        //console.log(list, extendList);
        for (var i = 0; i < len; i++) {
            extend = list[i].prototype;
            for (var n in extend) {
                if (n == "extend" || n == "Static") continue;
                if (n == "Protected" || (isGroupProp(extend, n))) {
                    mergeGroupDefine(objDefine, extend, n);
                    continue;
                }
                if (!$pcode.isUndefined(objDefine[n])) continue;
                t = extend[n];
                //                if ($pcode.isArray(t)) {
                //                    t = $pcode.cloneArray(t, true);
                //                } else if ($pcode.isObject(t)) {
                //                    t = $pcode.cloneObject(t, true);
                //                }
                objDefine[n] = t;
            }
            groupList = getGroupList(extend);
            if (groupList) {
                objDefine["$grouplists"] = $pcode.mergeArray(getGroupList(objDefine), groupList);
            }

            //if (extend["extend"]) {
            //makeDefineAttribute(objDefine, extend["extend"]);
            //}
        }
        if (getGroupList(objDefine)) {
            objDefine["$grouplists"] = $pcode.linq(getGroupList(objDefine))
            .unique().toArray();
        }
        t = extend = groupList = null;
    },
    mergeGroupDefine = function (objDefine, extend, name) {
        //合并分组
        var obj = $pcode.isNull(objDefine[name]) ? {} : objDefine[name];
        var ot = extend[name];
        var t = null;
        for (var n in ot) {
            if (!$pcode.isUndefined(obj[n])) continue;
            t = ot[n];
            //            if ($pcode.isArray(t)) {
            //                t = $pcode.cloneArray(t, true);
            //            } else if ($pcode.isObject(t)) {
            //                t = $pcode.cloneObject(t, true);
            //            }
            obj[n] = t;
        }
        objDefine[name] = obj;
        objDefine = extend = obj = ot = null;
    },
    makeDefineisConstructorOfFun = function (objDefine, def) {
        objDefine.isConstructorOf = function (Constructor) {
            if (def == Constructor || Object == Constructor) return true;
            var extend = this.isConstructorOf.extend;
            return isConstructorOf_Pri(this.isConstructorOf.extend, Constructor);
        };
        objDefine.isConstructorOf.extend = objDefine["extend"] ? $pcode.mergeArray([], objDefine["extend"]) : [];
        //objDefine.$runtimes = {};
        //objDefine.$runtimes.$extendTemp = [];
        objDefine.baseApply = function (methodname, pos, args) {
            return _runBaseFun.call(this, objDefine, methodname, pos, args);
        };
        objDefine.baseCall = function (methodname, pos, params) {
            var args = $pcode.sliceArray(arguments, 2);
            return _runBaseFun.call(this, objDefine, methodname, pos, args);
        };
        //console.log([objDefine["$classname"], objDefine["extend"]]);

    },
    isConstructorOf_Pri = function (extend, Constructor) {
        if (!extend) return false;
        for (var i = 0, len = extend.length; i < len; i++) {
            if (extend[i] == Constructor) return true;
            if (isConstructorOf_Pri(extend[i].prototype.isConstructorOf.extend, Constructor))
                return true;
        }
        return false;
    },
    makeDefineDisposeFun = function (objDefine) {
        if (objDefine.dispose) return;
        objDefine.dispose = function () {
            if (this.dispose != $pcode.noop) {
                this.dispose = $pcode.noop;
                //if (this.Event && this.Event.has && this.Event.has("onDispose"))
                if (this.Event && this.Event.has)
                    this.Event.trigger("onDispose", this);
                var grouplists = getGroupList(this);
                var n;
                for (var i = 0, len = grouplists.length; i < len; i++) {
                    n = grouplists[i];
                    if ($pcode.isObject(this[n])) {
                        //console.log("clear: " + n);
                        $pcode.clearObject(this[n]);
                    }
                }
                $pcode.clearObject(this);
            }
        };
        objDefine.islinkToDom = false;
        objDefine.linkToDom = function (jqSelector) {
            this.islinkToDom = true;
            var $this = this;
            return $pcode.linkToDom(jqSelector, function () {
                $this && $this.dispose();
                $this = jqSelector = null;
            });
        };
        objDefine = null;
    },
    getGroupList = function (obj) {
        return obj["$grouplists"];
    },
    isGroupProp = function (obj, propname) {
        var gl = getGroupList(obj);
        return (gl && $pcode.inArray(propname, gl) >= 0);
    };

    //resetObject
    var resetObjectAttribute = function (obj) {
        var t = null;
        for (var n in obj) {
            if (n == "extend" || n == "Static") continue;
            t = obj[n];
            //            if ($pcode.isArray(t)) {
            //                t = $pcode.cloneArray(t, true);
            //            } else if ($pcode.isObject(t)) {
            //                t = $pcode.cloneObject(t, true);
            //            }
            if ($pcode.isObject(t))
                t = resetO(t);
            if (isGroupProp(obj, n)) {
                //console.log(n);
                makeObjectAttributeSelfFun(t, obj);
                //continue;
            }
            obj[n] = t;
        }
        //console.log(getGroupList(obj));
        t = null;
    },
    makeObjectAttributeSelfFun = function (obj, parent) {
        obj["$this"] = function () {
            return parent;
        };
        obj = null;
    };

    var resetO = function (obj) {
        if ($pcode.isArray(obj)) {
            obj = resetA(obj);
        } else {
            var f = new Function();
            f.prototype = obj;
            obj = new f();
            obj = resetOIn(obj);
            f = null;
        }
        return obj;
    },
    resetOIn = function (obj) {
        var t = null;
        for (var n in obj) {
            //console.log(n);
            t = obj[n];
            if ($pcode.isObject(t)) {
                obj[n] = resetO(t);
                if (isGroupProp(obj, n)) {
                    //console.log(["resetOIn", n]);
                    makeObjectAttributeSelfFun(obj[n], obj);
                    //continue;
                }
            }
        }
        t = null;
        //console.log(obj);
        return obj;
    },
    resetA = function (list) {
        var lT = [];
        var t = null;
        for (var i = 0, len = list.length; i < len; i++) {
            t = list[i];
            if ($pcode.isObject(t))
                t = resetO(t);
            lT.push(t);
        }
        t = null;
        return lT;
    };

})();



(function () {
    //version 1.0.1.31
    "use strict";
    var $pcode = window.$pcode;

    $pcode.extend({
        DefineClass: function (extend) {
            /// <summary>
            /// 
            /// </summary>
            /// <param name="extend"></param>
            /// <returns type="$pcode.DefineClass.DefineClassClass"></returns>
            if (extend instanceof $pcode.DefineClass.DefineClassClass)
                return extend;
            if (arguments.length > 1)
                extend = $pcode.sliceArray(arguments);
            return new $pcode.DefineClass.DefineClassClass(extend);
        }
    });

    $pcode.extend($pcode.DefineClass, {
        DefineClassClass: function (extend) {
            //console.log(extend);
            this.privateDefineClass = $pcode.cloneObject(this.privateDefineClass, true);
            this.privateDefineClass.define = {};
            extend && this.Extend(extend);
            this.DefineGroup("Event", {
                events: [],
                on: function (eventnames, callback) {
                    if (!callback) return;
                    var $this = this;
                    $pcode.linq(eventnames.split(',')).each(function () {
                        $this.events.push({ eventname: $pcode.trim(this), callback: callback });
                    });
                    callback = $this = null;
                    return this;
                },
                off: function (eventnames, callback) {
                    var eventnameL = $pcode.linq(eventnames.split(',')).select(function () { return $pcode.trim(this); }).toArray();
                    this.events = $pcode.linq(this.events)
                        .where(function () { return (this.callback != callback); })
                        .where(function () { return ($pcode.inArray(this.eventname, eventnameL) < 0 || callback); })
                        .toArray();
                    //console.log(this.events);
                    callback = eventnameL = null;
                    return this;
                },
                trigger: function (eventnames, args) {
                    this.triggerHandler.apply(this, arguments);
                    args = null;
                    return this;
                },
                triggerHandler: function (eventnames, args) {
                    args = $pcode.linq(arguments).take(1);
                    var eventnameL = $pcode.linq(eventnames.split(',')).select(function () { return $pcode.trim(this); }).toArray();
                    //console.log(args);
                    var eventRet = null;
                    $pcode.linq(this.events)
                        .where(function () { return ($pcode.inArray(this.eventname, eventnameL) >= 0); })
                        .each(function () {
                            eventRet = this.callback.apply(null, args);
                            if (eventRet === false)
                                return false;
                            //return $pcode.linq.LinqObject.
                        });
                    //console.log(list);
                    args = eventnameL = null;
                    return eventRet;
                },
                has: function (eventnames) {
                    var eventnameL = $pcode.linq(eventnames.split(',')).select(function () { return $pcode.trim(this); }).toArray();
                    return $pcode.linq(this.events)
                        .where(function () { return ($pcode.inArray(this.eventname, eventnameL) >= 0); })
                        .contain();
                },
                onDispose: function (callback) {
                    /// <summary>
                    /// onDispose(function(sender){})
                    /// </summary>
                    /// <param name="callback"></param>
                    this.on("onDispose", callback);
                    return this;
                }
            });
            //var $this = this;
            //this.privateDefineClass.define.getDefineObject = function () { return $this; };
            //this.clear(function () { $this = null; });
            extend = null;
        }
    });

    $pcode.extend($pcode.DefineClass.DefineClassClass.prototype, {
        privateDefineClass: {
            define: {}
        },
        //==================================
        Extend: function (extend) {
            if (!this.privateDefineClass.define.extend)
                this.privateDefineClass.define.extend = [];
            //extend可能是数组, 参数情况:Extend([ClassA, ClassB], ClassC)

            if (arguments.length > 1)
                extend = $pcode.sliceArray(arguments);
            //console.log(extend);
            this.privateDefineClass.define.extend = $pcode.linq($pcode.mergeArray(this.privateDefineClass.define.extend, extend)).unique().toArray();
            //console.log(this.privateDefineClass.define.extend);
            return this;
        },
        Static: function (define) {
            if (!this.privateDefineClass.define.Static)
                this.privateDefineClass.define.Static = {};
            $pcode.extend(this.privateDefineClass.define.Static, define);
            return this;
        },
        Define: function (define) {
            $pcode.extend(this.privateDefineClass.define, define);
            return this;
        },
        DefineGroup: function (name, define) {
            if (!this.privateDefineClass.define[name]) {
                this.privateDefineClass.define[name] = { $this: $pcode.noop };
            }
            $pcode.extend(this.privateDefineClass.define[name], define);
            if (!this.privateDefineClass.define["$grouplists"]) {
                this.privateDefineClass.define["$grouplists"] = [];
            }
            this.privateDefineClass.define["$grouplists"].push(name);
            //this.privateDefineClass.define[name]["$isGroup"] = true;
            return this;
        },
        Event: function (define) {
            this.DefineGroup("Event", define);
            return this;
        },
        Init: function (callback) {
            if (!$pcode.isFunction(callback)) return this;
            this.privateDefineClass.define.init = callback;
            return this;
        },
        ReturnDefine: function () {
            return this.privateDefineClass.define;
        },
        Class: function (classname) {
            return $pcode.Class.classDefine(classname, this.ReturnDefine(), $pcode.stringEmpty);
        }
    });

})();


(function () {
    //version 1.0.1.31
    "use strict";
    var $pcode = window.$pcode;

    $pcode.extend({
        linq: function (list) {
            if (list instanceof $pcode.linq.LinqObject)
                return list;
            return new $pcode.linq.LinqObject(list);
        }
    });

    $pcode.extend($pcode.linq, {
        LinqObject: function (list) {
            this.privateLinqObject = $pcode.cloneObject(this.privateLinqObject, true);
            this.from(list);
        },
        QType: { where: "where", order: "order", select: "select", selectMerge: "selectMerge", unique: "unique" },
        BREAK: "break_ps_20121206"
    });

    $pcode.extend($pcode.linq.LinqObject.prototype, {
        privateLinqObject: {
            froms: [],
            whereAndOrder: [],
            group: $pcode.noop,
            clear: $pcode.noop,
            result: [],
            isChange: true,
            orderArray: function (list, orderCall) {
                if (list.length <= 1) return list;
                list.sort(orderCall);
                orderCall = null;
                return list;
            },
            takeList: function (listFrom, pos, count) {
                return $pcode.sliceArray(listFrom, pos, count);
//                if (listFrom.slice) {
//                    return listFrom.slice(pos, pos + count);
//                } else {
//                    var list = [];
//                    for (var i = 0, len = listFrom.length; i < len; i++) {
//                        if (count <= 0) break;
//                        if (pos <= 0) {
//                            list.push(listFrom[i]);
//                            count--;
//                        } else {
//                            pos--;
//                        }
//                    }
//                    return list;
//                }
            },
            passWhere: function (wheres, item, index) {
                return wheres.call(item, item, index);
            },
            whereArray: function (listFrom, wheres, pos, count) {
                //if (listFrom.length <= 0) return listFrom;

                var list = [];
                var ret = null;
                for (var i = 0, len = listFrom.length; i < len; i++) {
                    ret = this.passWhere(wheres, listFrom[i], i);
                    if (ret === $pcode.linq.BREAK) break;
                    if (ret) {
                        if (count <= 0) break;
                        if (pos <= 0) {
                            list.push(listFrom[i]);
                            count--;
                        } else {
                            pos--;
                        }
                    }
                }
                return list;
            },
            selectArray: function (listFrom, callback, pos, count) {
                //if (listFrom.length <= 0) return listFrom;
                var list = [];
                var iT = null;
                for (var i = 0, len = listFrom.length; i < len; i++) {
                    if (count <= 0) break;
                    if (pos <= 0) {
                        iT = listFrom[i];
                        list.push(callback.call(iT, iT, i));
                        count--;
                    } else {
                        pos--;
                    }
                }
                listFrom = iT = null;
                return list;
            },
            selectMergeArray: function (listFrom, callback, pos, count) {
                //if (listFrom.length <= 0) return listFrom;
                var list = [];
                var iT = null;
                for (var i = 0, len = listFrom.length; i < len; i++) {
                    if (count <= 0) break;
                    if (pos <= 0) {
                        iT = listFrom[i];
                        list = list.concat(callback.call(iT, iT, i));
                        count--;
                    } else {
                        pos--;
                    }
                }
                listFrom = iT = null;
                return list;
            },
            toUnique: function (list, callback, pos, count) {
                var rList = [];
                var it = null;
                for (var i = 0, len = list.length; i < len; i++) {
                    it = list[i];
                    if ($pcode.inArray(it, rList) < 0) {
                        if (count <= 0) break;
                        if (pos <= 0) {
                            rList.push(it);
                            count--;
                        } else {
                            pos--;
                        }
                    }
                }
                this.result = rList;
                list = rList = it = null;
                return this.result;
            },
            toArray: function (pos, count, reverse) {
                var isAll = false;
                if (pos < 0) {
                    isAll = true;
                    pos = 0;
                }
                if (!this.isChange) {
                    if (isAll) {
                        return this.result.slice(pos, pos + count);
                    } else {
                        return this.takeList(this.result, pos, count);
                    }
                }
                //this.isChange = false;
                //this.result = this.froms;
                if (this.froms.length <= 0) {
                    this.result = [];
                    return this.result;
                }

                var whereAndOrder = this.whereAndOrder;
                var len = whereAndOrder.length;
                var list = this.froms;
                if (len <= 0) {
                    this.result = isAll ? list : this.takeList(list, pos, count);
                    return this.result;
                }

                var typeEnum = $pcode.linq.QType;
                var ot = null;
                //console.log(whereAndOrder);
                var last = len - 1;
                var isLast = false;
                for (var i = 0; i < len; i++) {
                    ot = whereAndOrder[i];
                    isLast = (i == last);
                    if (reverse === true && isLast)
                        list.reverse();
                    switch (ot.type) {
                        case typeEnum.order:
                            list = this.orderArray(list, ot.callback);
                            if (!isAll && isLast) {
                                list = this.takeList(list, pos, count);
                            }
                            break;
                        case typeEnum.select:
                            if (!isAll && isLast) {
                                list = this.selectArray(list, ot.callback, pos, count);
                            } else {
                                list = this.selectArray(list, ot.callback, 0, list.length);
                            }
                            break;
                        case typeEnum.selectMerge:
                            if (!isAll && isLast) {
                                list = this.selectMergeArray(list, ot.callback, pos, count);
                            } else {
                                list = this.selectMergeArray(list, ot.callback, 0, list.length);
                            }
                            break;
                        case typeEnum.unique:
                            if (!isAll && isLast) {
                                list = this.toUnique(list, ot.callback, pos, count);
                            } else {
                                list = this.toUnique(list, ot.callback, 0, list.length);
                            }
                            break;
                        case typeEnum.where:
                            if (!isAll && isLast) {
                                list = this.whereArray(list, ot.callback, pos, count);
                            } else {
                                list = this.whereArray(list, ot.callback, 0, list.length);
                            }
                            break;
                    }
                    if (list.length <= 0) break;
                }

                this.result = list;
                list = null;
                this.toGroup();
                return this.result;
            },
            pushWhereAndOrder: function (type, callback) {
                this.whereAndOrder.push({ type: type, last: false, callback: callback });
                callback = null;
            },
            //=============
            getGroupByValue: function (value, rList) {
                var len = rList.length;
                for (var i = 0; i < len; i++) {
                    if (rList[i].value == value)
                        return rList[i];
                }
                return null;
            },
            makeGroup: function (list) {
                if (this.group == $pcode.noop || this.result.length <= 0) return;
                var callback = this.group;
                var rList = [];
                //var list = this.result;
                var len = list.length;
                var iT = null;
                var rT = null;
                var vT = null;
                for (var i = 0; i < len; i++) {
                    iT = list[i];
                    vT = callback.call(iT, iT, i);
                    rT = this.getGroupByValue(vT, rList);
                    if (rT == null) {
                        rT = { value: vT, items: [iT] };
                        rList.push(rT);
                    } else {
                        rT.items.push(iT);
                    }
                }
                this.result = rList;
                rList = list = callback = null;
                iT = rT = vT = null;
                return this.result;
            },
            toGroup: function (list) {
                //this.toArray();
                this.makeGroup(list);
                //this.isChange = false;
                return this.result;
            },
            doClear: function () {
                if (this.clear != $pcode.noop) {
                    this.clear();
                    this.clear = $pcode.noop;
                }
            }
        },
        from: function (list) {
            this.privateLinqObject.isChange = true;
            this.privateLinqObject.froms = list ? (list instanceof window.jQuery ? list.toArray() : list) : [];
            return this;
        },
        concat: function () {
            this.privateLinqObject.isChange = true;
            var list = null;
            for (var i = 0, len = arguments.length; i < len; i++) {
                list = arguments[i];
                this.privateLinqObject.froms = this.privateLinqObject.froms.concat(list ? (list instanceof window.jQuery ? list.toArray() : list) : []);
            }
            list = null;
            return this;
        },
        where: function (callback) {
            //callback(item, index, name)
            //this.privateLinqObject.where.push(callback);
            this.privateLinqObject.isChange = true;
            this.privateLinqObject.pushWhereAndOrder($pcode.linq.QType.where, callback);
            callback = null;
            return this;
        },
        order: function (callback) {
            //callback(item1, item2)
            //this.privateLinqObject.order.push(callback);
            this.privateLinqObject.isChange = true;
            this.privateLinqObject.pushWhereAndOrder($pcode.linq.QType.order, callback);
            callback = null;
            return this;
        },
        select: function (callback) {
            this.privateLinqObject.isChange = true;
            this.privateLinqObject.pushWhereAndOrder($pcode.linq.QType.select, callback);
            //this.privateLinqObject.select = callback;
            callback = null;
            return this;
        },
        selectMerge: function (callback) {
            //callback(item)
            this.privateLinqObject.isChange = true;
            this.privateLinqObject.pushWhereAndOrder($pcode.linq.QType.selectMerge, callback);
            //this.privateLinqObject.selectMerge = callback;
            callback = null;
            return this;
        },
        unique: function () {
            //callback(item)
            this.privateLinqObject.isChange = true;
            this.privateLinqObject.pushWhereAndOrder($pcode.linq.QType.unique, null);
            // callback = null;
            return this;
        },
        clear: function (callback) {
            //callback(item)
            if (callback) {
                this.privateLinqObject.clear = callback;
            } else {
                this.privateLinqObject.doClear();
            }
            callback = null;
            return this;
        },
        take: function (pos, count) {
            if (isNaN(count) || count < 0)
                count = this.privateLinqObject.froms.length;
            var list = this.privateLinqObject.toArray(pos, count, false);
            this.privateLinqObject.doClear();
            return list;
        },
        toArray: function () {
            this.privateLinqObject.toArray(-1, this.privateLinqObject.froms.length, false);
            this.privateLinqObject.isChange = false;
            if (arguments[0] !== false)
                this.privateLinqObject.doClear();
            return this.privateLinqObject.result;
        },
        each: function (callback) {
            var list = this.toArray(false);
            var len = list.length;
            var iT = null;
            var tRR = null;
            for (var i = 0; i < len; i++) {
                iT = list[i];
                tRR = callback.call(iT, iT, i);
                if (tRR === false || tRR === $pcode.linq.BREAK) break;
            }
            callback = list = iT = tRR = null;
            //this.privateLinqObject.doClear();
            return this;
        },
        first: function (defalutvalue) {
            var list = this.privateLinqObject.toArray(0, 1, false);
            var ot = null;
            if (list.length <= 0)
                ot = $pcode.isFunction(defalutvalue) ? defalutvalue() : defalutvalue;
            else
                ot = list[0];
            this.privateLinqObject.doClear();
            return ot;
        },
        last: function (defalutvalue) {
            var list = this.privateLinqObject.toArray(0, 1, true);
            var ot = null;
            if (list.length <= 0)
                ot = $pcode.isFunction(defalutvalue) ? defalutvalue() : defalutvalue;
            else
                ot = list[0];
            this.privateLinqObject.doClear();
            return ot;
        },
        contain: function () {
            return !$pcode.isNull(this.first());
        },
        group: function (callback) {
            this.privateLinqObject.group = callback;
            callback = null;
            return this;
        },
        count: function (callback) {
            if (callback) {
                var n = 0;
                this.each(function (item, index) {
                    n += (callback.call(this, this, index) ? 1 : 0);
                });
                callback = null;
                this.privateLinqObject.doClear();
                return n;
            } else {
                return this.toArray().length;
            }
        },
        sum: function (callback) {
            var n = 0;
            if (callback) {
                this.each(function (item, index) {
                    n += (callback.call(this, this, index));
                });
                callback = null;
            } else {
                this.each(function (item) {
                    n += this;
                });
            }
            this.privateLinqObject.doClear();
            return n;
        },
        avg: function (callback) {
            var n = 0;
            if (callback) {
                this.each(function (item, index) {
                    n += (callback.call(this, this, index));
                });
                callback = null;
            } else {
                this.each(function (item) {
                    n += this;
                });
            }
            this.privateLinqObject.doClear();
            return (n == 0 ? 0 : n / this.privateLinqObject.result.length);
        }
    });

    //console.log($pcode.linq([1, 2, 5, 8, 3, 78, 7, 8, 78]).select(function(){return this *10;}).take(1, 3));

})();




(function () {
    //version 1.0.1.31
    "use strict";
    var $pcode = window.$pcode;


    $pcode.extend({
        linkToDom: function (jSelector, callback) {
            return $pcode.linkToDom.linkManager.addLink(jSelector, callback);
        },
        unlinkToDom: function (link) {
            if (link && link.unlink) {
                link.unlink();
            }
            link = null;
        },
        disconnectToDom: function (link) {
            if (link && link.disconnect) {
                link.disconnect();
            }
            link = null;
        }
    });

    var _unlink = function () {
        this.callback = $pcode.noop;
        if (this.target instanceof window.jQuery) {
            this.target.removeData(this.id);
        }
    };
    var _disconnect = function () {
        if (this.target instanceof window.jQuery) {
            this.target.removeData(this.id);
        }
    };


    $pcode.extend($pcode.linkToDom, {
        linkManager: {
            links: [],
            isUnload: false,
            intervalTime: 3000,
            intervalId: null,
            checkPos: 0,
            checkCount: 100,
            addLink: function (jSelector, callback) {
                if (this.isUnload) return;
                var link = null;
                if (callback) {
                    var jTarget = jSelector instanceof window.jQuery ? jSelector : $(jSelector);
                    if (jTarget.size() > 0) {
                        link = { id: "linkToDom_130102_" + $pcode.makeAutoId(), target: jTarget, callback: callback, unlink: _unlink, disconnect: _disconnect };
                        jTarget.data(link.id, "T");
                        this.links.push(link);
                        this.checkAndStart();
                        //console.log(["addLink", link.id]);
                    } else {
                        callback && callback();
                    }
                    jTarget = null;
                }
                jSelector = callback = null;
                return link;
            },
            removeLink: function (link) {
                if (link && !this.isUnload) {
                    link = $pcode.mergeArray([], link);
                    this.links = $pcode.linq(this.links)
                    .where(function () { return ($pcode.inArray(this, link) < 0); })
                    .toArray();
                    $pcode.linq(link).each(function () {
                        //console.log(this.target);
                        this.target = undefined;
                        this.callback = undefined;
                    });
                    //console.log(["removeLink", $pcode.linq(link).select(function () { return this.id }).toArray()]);
                    this.checkAndEnd();
                }
                link = null;
            },
            check: function () {
                if (this.isUnload) return;
                var link = null;
                var chCount = this.checkCount;
                var clearList = [];
                try {
                    //console.log(["check", this.links.length, this.checkPos]);
                    for (var len = this.links.length; this.checkPos < len; this.checkPos++) {
                        link = this.links[this.checkPos];
                        if (link.target.data(link.id) !== "T") {
                            clearList.push(link);
                            link.callback && link.callback();
                        }
                        chCount--;
                        if (chCount <= 0) break;
                    }
                    this.checkPos++;
                } finally {
                    link = null;
                    this.checkPos -= clearList.length;
                    (clearList.length > 0) && this.removeLink(clearList);
                    clearList = null;
                    if (this.checkPos >= this.links.length)
                        this.checkPos = 0;
                }
            },
            checkAndStart: function () {
                if (this.intervalId != null || this.links.length <= 0) return;
                //console.log(["startCheck"]);
                this.checkPos = 0;
                this.intervalId = setInterval(function () {
                    $pcode.linkToDom.linkManager.check();
                }, this.intervalTime);
            },
            checkAndEnd: function () {
                if (this.intervalId == null || this.links.length > 0) return;
                //console.log(["endCheck"]);
                clearInterval(this.intervalId);
                this.intervalId = null;
            },
            clearAllOnUnload: function () {
                this.isUnload = true;
                if (this.intervalId != null) {
                    clearInterval(this.intervalId);
                    this.intervalId = null;
                }
                $pcode.linq(this.links)
                    .each(function () {
                        if (this.callback) {
                            this.callback();
                        }
                    });
            }
        }
    });

    var linkManager = $pcode.linkToDom.linkManager;
    $(window).unload(function () {
        try {
            linkManager.clearAllOnUnload();
        } finally {
            linkManager = null;
        }
    });
})();



(function () {
    //version 1.0.1.31
    "use strict";
    var $pcode = window.$pcode;

    $pcode.extend({
        linEv: function (obj) {
            if (obj instanceof $pcode.linEv.linEvObject)
                return obj;
            return new $pcode.linEv.linEvObject(obj);
        }
    });

    $pcode.extend($pcode.linEv, {
        linEvObject: function (obj) {
            this.privateLinEvObject = {};
            var objIn = new $pcode.linEv.linEvObjectClass();

            if (obj) {
                $pcode.extend(objIn, obj);
            }
            var $this = this;
            objIn.getLinEvObject = function () { return $this; };
            objIn.onDispose = function (callback) {
                this.Event.onDispose(callback);
                callback = null;
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
            if (!obj) return;
            $pcode.extend(this.privateLinEvObject.obj, obj);
            obj = null;
            return this;
        },
        define: function (callback) {
            callback && callback.apply(this.privateLinEvObject.obj);
            callback = null;
            return this;
        },
        init: function (callback) {
            callback && callback.apply(this.privateLinEvObject.obj);
            callback = null;
            return this;
        },
        event: function (define) {
            if (define) {
                $pcode.extend(this.privateLinEvObject.obj.Event, define);
            }
            define = null;
            return this;
        },
        eval: function (callback) {
            callback && callback.apply(this.privateLinEvObject.obj);
            callback = null;
            return this;
        },
        async: function (callback, time) {
            if (callback) {
                var obj = this.privateLinEvObject.obj;
                if (isNaN(time))
                    time = 0;
                setTimeout(function () {
                    callback.apply(obj);
                    obj = null;
                }, time);
            }
            return this;
        },
        ready: function (callback) {
            var $this = this;
            $(function () {
                try {
                    $this.eval(callback);
                } finally {
                    $this = null;
                }
            });
            return this;
        },
        each: function (callback) {
            if (callback) {
                var obj = this.privateLinEvObject.obj;
                for (var n in obj) {
                    callback.call(obj, obj[n], n);
                }
                obj = null;
            }
            callback = null;
            return this;
        },
        clear: function (callback) {
            if (callback) {
                this.privateLinEvObject.obj.Event.onDispose(callback);
            } else {
                this.privateLinEvObject.obj.dispose();
            }
            callback = null;
            return this;
        },
        linkToDOM: function (jqselector) {
            //this.privateLinEvObject.clearByJquery(jqselector);
            this.privateLinEvObject.obj.linkToDom(jqselector);
            return this;
        },
        evalReturn: function (callback, keep) {
            var objIn = this.privateLinEvObject.obj;
            var retO = ((callback && callback.apply(objIn)) || objIn);
            callback = null;
            if (!objIn.islinkToDom && keep !== true)
                objIn.dispose();
            objIn = null;
            return retO;
        }
    });

    $pcode.DefineClass()
        .Class("$pcode.linEv.linEvObjectClass");

    //new $pcode.linEv.linEvObjectClass().linkToDom();
})();



(function () {
    //version 1.0.2.1
    "use strict";
    var $pcode = window.$pcode;

    $pcode.extend({
        databind: function (jqselector, data, map, convert) {
            var jTarget = $pcode.isJquery(jqselector) ? jqselector : $(jqselector);
            if (jTarget.size() > 0 && data) {
                this.dataUnbind(jTarget);
                return new $pcode.databind.databindClass(jTarget, data, map, convert);
            } else {
                return null;
            }
        },
        dataUnbind: function (jqselector) {
            var jTarget = $pcode.isJquery(jqselector) ? jqselector : $(jqselector);
            if (jTarget.size() > 0) {
                var databind = jTarget.data("databind_20120114");
                if (databind) {
                    databind.unlink();
                    jTarget.removeData("databind_20120114");
                }
                databind = null;
            }
            jTarget = jqselector = null;
        },
        databindSubmit: function (jqselector, autoUnbind) {
            var jTarget = $pcode.isJquery(jqselector) ? jqselector : $(jqselector);
            if (jTarget.size() > 0) {
                var databind = jTarget.data("databind_20120114");
                if (databind) {
                    databind.submit();
                    if (autoUnbind === true) {
                        this.dataUnbind(jTarget);
                    }
                }
                databind = null;
            }
            jTarget = jqselector = null;
        }
    });

    $pcode.DefineClass()
        .Event({
            onSetData: function (callback) {
                this.on("onSetData", callback);
                return this;
            },
            onSetDataBefore: function (callback) {
                this.on("onSetDataBefore", callback);
                return this;
            },
            onSubmit: function (callback) {
                this.on("onSubmit", callback);
                return this;
            },
            onSubmitBefore: function (callback) {
                this.on("onSubmitBefore", callback);
                return this;
            },
            onChangeBefore: function (callback) {
                this.on("onChangeBefore", callback);
                return this;
            }
        })
        .DefineGroup("privateDatabind", {
            linkdom: null,
            jTarget: null,
            data: null,
            map: null,
            convert: null,
            setData: function (data) {
                this.data = data;
                data = null;
                this.$this().Event.trigger("onSetDataBefore", this.$this(), this.data, this.jTarget);
                this.pushData();
                this.$this().Event.trigger("onSetData", this.$this(), this.data, this.jTarget);
            },
            setMap: function (map) {
                this.map = map;
            },
            setConvert: function (convert) {
                this.convert = convert;
            },
            initMapAndConvert: function () {
                var map = null;
                var convert = this.convert;
                if (!this.map) {
                    //this.initMapName(this.data, $pcode.stringEmpty);
                    map = {};
                    $('[name]', this.jTarget).each(function () {
                        var name = $(this).attr("name");
                        map[name] = { targetname: name, convert: (convert ? convert[name] : null) };
                    });
                    this.map = map;
                } else {
                    map = this.map;
                    for (var mn in map) {
                        map[mn] = { targetname: map[mn], convert: (convert ? convert[mn] : null) };
                    }
                }
                map = convert = null;
            },
            extendMap: function (map, convert) {
                for (var mn in map) {
                    this.map[mn] = { targetname: map[mn], convert: (convert ? convert[mn] : null) };
                }
                map = convert = null;
            },
            getMap: function (name) {
                return this.map ? this.map[name] : null;
            },
            getMapNameByTargetName: function (targetname) {
                var names = [];
                for (var n in this.map) {
                    if (this.map[n].targetname == targetname)
                        names.push(n);
                }
                return names;
            },
            toDomAndConvert: function (name) {
                var map = this.getMap(name);
                if (!map) return;
                var targetname = map.targetname;

                var jO = this.getTarget(targetname);
                if (jO.size() > 0) {
                    var val = $pcode.getDataValue(this.data, name);
                    var convert = map.convert && map.convert.toDom; // this.getConvertToDomCallBack(name);
                    if (convert) {
                        val = convert.call(this.$this(), val, this.data, jO); //function(value, data, jtarget)
                        jO.val(val);
                    } else if (!$pcode.isUndefined(val)) {
                        jO.val(val);
                    }
                    convert = val = null;
                }
                jO = map = null;
            },
            getTaretValue: function (jTarget) {
                var val = $pcode.stringEmpty;
                if (jTarget.is(":radio")) {
                    //console.log([$pcode.format('[name="{0}"]:checked', jTarget.attr("name")), $($pcode.format('[name="{0}"]:checked', jTarget.attr("name")), jTarget).size()]);
                    val = $($pcode.format('[name="{0}"]:checked', jTarget.attr("name")), this.jTarget).val();
                } else if (jTarget.is('[type="checkbox"]')) {
                    if (jTarget.prop("checked"))
                        val = jTarget.val();
                } else {
                    val = jTarget.val();
                }
                jTarget = null;
                return val;
            },
            toDataAndConvert: function (name) {
                var map = this.getMap(name);
                if (!map) return;
                var targetname = map.targetname;

                var jO = this.getTarget(targetname);
                if (jO.size() > 0) {
                    var val = this.getTaretValue(jO);
                    //var convert = this.getConvertToDataCallBack(name);
                    var convert = map.convert && map.convert.toData;
                    if (convert) {
                        val = convert.call(this.$this(), val, this.data, jO);   //function(value, data, jtarget)
                    }
                    $pcode.setDataValue(this.data, name, val);
                    val = convert = null;
                }
                jO = map = null;
            },
            pushData: function () {
                var data = this.data;
                var map = this.map;
                for (var n in map) {
                    this.toDomAndConvert(n);
                }
                data = map = null;
            },
            getTarget: function (name) {
                return $($pcode.format('[name="{0}"]:first', name), this.jTarget);
            },
            val: function (name, value) {
                if (arguments.length == 1) {
                    this.toDataAndConvert(name);
                    return $pcode.getDataValue(this.data, name)
                } else {
                    $pcode.setDataValue(this.data, name, value);
                    this.toDomAndConvert(name);
                }
            },
            submit: function () {
                var $this = this.$this();
                if (!$this) return;
                $this.Event.trigger("onSubmitBefore", this.$this(), this.data, this.jTarget);
                var data = this.data;
                var map = this.map;
                for (var n in map) {
                    this.toDataAndConvert(n);
                }
                $this.Event.trigger("onSubmit", this.$this(), this.data, this.jTarget);
                data = map = null;
            },
            doEvent: function (e, target) {
                var jtarget = $(target);
                var targetname = jtarget.attr("name");
                var nameLists = this.getMapNameByTargetName(targetname);
                var name = null;
                //console.log(nameLists);
                if (nameLists && nameLists.length > 0) {
                    for (var i = 0, len = nameLists.length; i < len; i++) {
                        name = nameLists[i];
                        if (this.$this().Event.has("onChangeBefore")) {
                            var val = this.getTaretValue(jtarget);
                            if (this.$this().Event.triggerHandler("onChangeBefore", this.$this(), name, val, this.data, this.jTarget) === false) return;
                        }
                        //console.log("ch");
                        this.toDataAndConvert(name);
                    }
                }
                e = target = jtarget = null;
            },
            onBaseEvent: function () {
                var $this = this;
                //                $('[name][type=checkbox],[name][type=radio]', this.jTarget).on("click.pcode_databind", function (e) {
                //                    //console.log(["click.pcode_databind", $(this).attr("name")]);
                //                    $this.doEvent(e, this);
                //                    e = null;
                //                });
                $('[name]', this.jTarget).on("change.pcode_databind", function (e) {
                    //console.log(["blur.pcode_databind", $(this).attr("name")]);
                    $this && $this.doEvent(e, this);
                    e = null;
                });
                //                $('select[name]', this.jTarget).on("change.pcode_databind", function (e) {
                //                    //console.log(["change.pcode_databind", $(this).attr("name")]);
                //                    $this.doEvent(e, this);
                //                    e = null;
                //                });
                this.$this().Event.onDispose(function () { $this = null; });
            },
            offBaseEvent: function () {
                //$('[name][type=checkbox],[name][type=radio]', this.jTarget).off("click.pcode_databind");
                $('[name]', this.jTarget).off("change.pcode_databind");
                //$('select[name]', this.jTarget).off("change.pcode_databind");
            }
        })
        .Define({
            getDomTarget: function () {
                return this.privateDatabind.jTarget;
            },
            getData: function () {
                this.submit();
                return this.privateDatabind.data;
            },
            setData: function (data) {
                this.privateDatabind.setData(data);
                data = null;
                return this;
            },
            extendMap: function (map, convert) {
                this.privateDatabind.extendMap(map, convert);
                map = convert = null;
                return this;
            },
            getTarget: function (name) {
                return this.privateDatabind.getTarget(name);
            },
            val: function (name, value) {
                if (arguments.length == 1) {
                    return this.privateDatabind.val(name);
                } else {
                    this.privateDatabind.val(name, value);
                    return this;
                }
            },
            submit: function () {
                this.privateDatabind.submit();
                return this;
            },
            unlink: function () {
                this.privateDatabind.offBaseEvent();
                $pcode.disconnectToDom(this.privateDatabind.linkdom);
            }
        })
        .Init(function (jqselector, data, map, convert) {
            var jTarget = jqselector instanceof window.jQuery ? jqselector : $(jqselector);
            jTarget.data("databind_20120114", this);

            this.privateDatabind.jTarget = jTarget;
            //this.privateDatabind.convert = convert;
            this.privateDatabind.setConvert(convert);
            this.privateDatabind.setMap(map);
            this.privateDatabind.initMapAndConvert();
            this.privateDatabind.setData(data);

            var $this = this;

            this.Event.onDispose(function () {
                $this = jqselector = data = map = jTarget = convert = null;
            });
            this.privateDatabind.linkdom = $pcode.linkToDom(jqselector, function () {
                $this.dispose();
                //console.log("privateDatabind");
            });
            this.privateDatabind.onBaseEvent();
        })
        .Class("$pcode.databind.databindClass");
})();


(function () {
    //version 1.0.1.31
    "use strict";
    var $pcode = window.$pcode;

    var undefined;
    var _startChar = "\{\{";
    var _endChar = "\}\}";
    //var _regTagText = _startChar + '(?:(\\/?if+|else|\\/?for)|([\\:\\>\\<])).*?(?!' + _startChar + ')(/*)' + _endChar;
    var _regTagText = _startChar + '([\\/\\:\\>\\<\\.\\$\\w]+).*?(?!' + _startChar + ')(/*)' + _endChar;
    var _regTag = new RegExp(_regTagText, "g");
    var _regSpecTag = new RegExp("^[\\:\\>\\<]");

    var _regForTmplTag = new RegExp('(.*?)\\s+tmpl=[\\\"\\\'](.*?)[\\\"\\\']');
    var _regTmplString = new RegExp("<.*>|" + _startChar + ".*" + _endChar);

    var _regMakeCodeDefine = new RegExp('(#index|#data|#view|#parent)', 'g');

    var replaceMakecodeDefine = function (evaltext) {
        return evaltext.replace(_regMakeCodeDefine, function (findtext) {
            findtext = findtext.replace('#', 'tmpl');
            return findtext + "_20130114_1"
        });
    };

    //#data
    //#index
    //#parent
    var makeCodeFunction = function (evaltext) {
        if ($pcode.isNullEmpty(evaltext)) return $pcode.noop;
        evaltext = replaceMakecodeDefine(evaltext);
        return new Function('tmpl', 'code', 'data', 'index', [
            'var tmplindex_20130114_1 = index;',
            'var tmpldata_20130114_1 = data;',
            'var tmplview_20130114_1 = tmpl.view;',
            'var tmplparent_20130114_1 = tmpl.parent();',
            'try {',
                'with (data) {',
                    'return ' + evaltext + ';',
                '}',
            '} catch (e) {',
                'if ($pcode.render.compile.isDebug){',
                    'return "Error: " + (e.message || e);',
                '}else{',
                    'return undefined;}',
            '} finally {',
                'tmplindex_20130114_1 = tmpldata_20130114_1 = null;',
                'tmpl = code = data = index = null;',
            '}'].join(''));
    }


    $pcode.extend({
        render: function (s, datas) {
            if ($pcode.isNullEmpty(s)) return s;
            var tmpl = $pcode.render.compile(s);
            if (tmpl.codes.length <= 1) return s;
            return tmpl.render(datas);
        },
        renderCompile: function (s) {
            return $pcode.render.compile(s);
        }
    });

    $pcode.extend($pcode.render, {
        compile: function (s) {
            var tmplD = null;
            var jo = null;
            if (!_regTmplString.test(s)) {
                jo = $(s);
                tmplD = jo.data("pcodeTmpl_20130115");
                if (tmplD) {
                    //console.log("=======================================");
                    return tmplD;
                }

                s = jo.html();
            } else {
                tmplD = $pcode.getCache(s);
                if (tmplD) {
                    return tmplD;
                }
            }
            tmplD = {
                codes: $pcode.render.compile.codeSplit(s),
                pos: 0,
                output: [],
                view: {},
                ifstatus: [],
                parents: [],
                tags: $pcode.render.tags,
                parent: function () {
                    if (this.parents.length <= 0) return null;
                    return this.parents.slice(-1)[0];
                },
                render: function (datas) {
                    $pcode.render.compile.runTmpl(this, datas);
                    var all = this.output.join('');
                    this.output = [];
                    return all;
                }
            };
            if (jo) {
                jo.data("pcodeTmpl_20130115", tmplD);
            } else {
                $pcode.setCache(s, tmplD);
            }
            return tmplD;
        },
        tags: function (define) {
            if (define) {
                $pcode.extend($pcode.render.tags.tagsObject, define);
            }
            define = null;
        }
    });

    $pcode.extend($pcode.render.tags, {
        tagsObject: {},
        getTags: function (tagname) {
            return this.tagsObject[tagname];
        }
    });

    $pcode.extend($pcode.render.compile, {
        isDebug: false,
        codeSplit: function (s) {
            /// <summary>
            /// 解释模板
            /// </summary>
            /// <param name="s"></param>
            var splitList = [];
            var pos = 0;
            var createEmptyNode = function (text) {
                /// <summary>
                /// 生成空节点
                /// </summary>
                /// <param name="text"></param>
                return {
                    isTextNode: true,   //是否为普通文本节点
                    text: text, //内容
                    command: undefined, //命令,(if, for, else)
                    commandparams: undefined,    //命令参数
                    type: undefined,    //类型, (:, >, <), {{:propname}}
                    propname: undefined,    //属性名称propname
                    single: true,  //是否为单节点, 如: {{for /}}, {{:propname}}
                    end: true,  //是否已经结束
                    fn: null,   //执行方法
                    tmpl: null,  //引用模板
                    level: 0,    //层次
                    children: []    //子项目
                };
            };

            (s + "").replace(_regTag, function (findText, command, single, findPos, allText) {
                /// <summary>
                /// 对模板分析并生成原始splitList
                /// </summary>
                /// <param name="findText">查找到的字串</param>
                /// <param name="command">if, for</param>
                /// <param name="single">是否单节点?{{for /}}, {{:propname}}</param>
                /// <param name="findPos">查找到的位置</param>
                /// <param name="allText">所有内容</param>

                //console.log(arguments);
                //return;
                //(:,>,<)
                var type = _regSpecTag.test(command) ? command.charAt(0) : $pcode.stringEmpty;

                var nodeData = createEmptyNode(allText.slice(pos, findPos));
                splitList.push(nodeData);

                nodeData = createEmptyNode(findText);
                nodeData.isTextNode = false;
                nodeData.type = type;
                nodeData.single = (single == "/");
                nodeData.end = (nodeData.single || (command && command.charAt(0) == "/"));
                nodeData.command = (command && command.charAt(0) == "/") ? command.slice(1) : command;

                if (!$pcode.isNullEmpty(type)) {
                    nodeData.command = type;
                    nodeData.commandparams = $pcode.trim(nodeData.text.slice(3, -2));
                } else if ((!nodeData.end || nodeData.single) && !$pcode.isNullEmpty(nodeData.command)) {

                    nodeData.commandparams = $pcode.trim(nodeData.text.slice(2 + nodeData.command.length, -2 - (nodeData.single ? 1 : 0)));
                    if (nodeData.command == "else" && $pcode.isNullEmpty(nodeData.commandparams))
                        nodeData.commandparams = "true";

                    if (nodeData.command == "for") {
                        if (nodeData.single) {
                            //nodeData.commandparams = $pcode.format("[].concat({0})", nodeData.commandparams.replace(' ', ','));
                            var tmplId = null;
                            //console.log(nodeData.commandparams)
                            nodeData.commandparams.replace(_regForTmplTag, function () {
                                //console.log(arguments);
                                nodeData.commandparams = arguments[1];
                                tmplId = arguments[2];
                            });
                            if (!$pcode.isNullEmpty(tmplId)) {
                                nodeData.tmpl = $pcode.render.compile($(tmplId).html());
                            }
                            //console.log(tmplId);
                        }
                        var commandparamsList = nodeData.commandparams.split(' ');
                        if (commandparamsList.length > 1) {
                            nodeData.commandparams = $pcode.format("[].concat({0})", "#data." + commandparamsList.join(',#data.'));
                        }
                        commandparamsList = null;
                    }
                }

                nodeData.fn = makeCodeFunction(nodeData.commandparams);

                splitList.push(nodeData);

                nodeData = null;
                pos = findPos + findText.length;
                //console.log(arguments);
            });

            if (pos < s.length) {
                splitList.push(createEmptyNode(s.slice(pos)));
            }

            //分析splitList, 计算level和生成children成员
            return $pcode.linEv({ splitList: splitList })
                .clear(function () { splitList = s = createEmptyNode = null; })
                .define(function () {
                    $pcode.extend(this, {
                        makeLevel: function () {
                            /// <summary>
                            /// 计算level层次
                            /// </summary>
                            var levelT = 0;
                            this.splitList = $pcode.linq(splitList)
                                .clear(function () { splitList = s = createEmptyNode = levelT = null; })
                                .each(function () {
                                    this.level = levelT;
                                    switch (this.command) {
                                        case "if":
                                            if (this.end) {
                                                levelT--;
                                                this.level = levelT;
                                            } else {
                                                levelT++;
                                            }
                                            break;
                                        case "else":
                                            //levelT--;
                                            this.level = levelT - 1;
                                            break;
                                        case "for":
                                            if (this.single) break;
                                            if (this.end) {
                                                levelT--;
                                                this.level = levelT;
                                            } else {
                                                levelT++;
                                            }
                                            break;
                                    }
                                })
                                .toArray();
                        },
                        makeChildrenList: function () {
                            /// <summary>
                            /// 生成children
                            /// </summary>
                            this.makeLevel();
                            //return;
                            var list = [];
                            var parents = [];

                            $pcode.linq(this.splitList)
                                .each(function () {
                                    parents[this.level] = this;
                                    if (this.level == 0) {
                                        list.push(this);
                                    } else {
                                        //console.log([this.level - 1, parents[this.level - 1]]);
                                        parents[this.level - 1].children.push(this);
                                    }
                                });

                            this.splitList = list;
                            list = parents = null;

                        }
                    });
                })
                .evalReturn(function () {
                    this.makeChildrenList();
                    return this.splitList;
                });
        },
        runTmpl: function (tmpl, datas) {
            datas = [].concat(datas);
            this.runTmplDataList(tmpl, tmpl.codes, datas);
            tmpl = datas = null;
        },
        runTmplDataList: function (tmpl, codelist, datas) {
            var runTmplCode = this.runTmplCode;
            var isRoot = tmpl.parent() ? true : false;
            $pcode.linq(datas)
                .each(function (item, index) {
                    isRoot && (tmpl.view = { data: item });
                    tmpl.pos = 0;
                    runTmplCode(tmpl, codelist, item, index);
                    item = null;
                });
            tmpl = codelist = datas = runTmplCode = null;
        },
        runTmplCode: function (tmpl, codelist, data, dataindex) {
            var runTmplCodeItem = $pcode.render.compile.runTmplCodeItem;
            $pcode.linq(codelist)
                .each(function () {
                    if (this.isTextNode)
                        tmpl.output.push(this.text);
                    else {
                        runTmplCodeItem(tmpl, this, data, dataindex); // tmpl.output.push(runTmplCodeItem(tmpl, code, data, dataindex));
                    }
                });

            codelist = runTmplCodeItem = null;
            tmpl = data = null;
        },
        runTmplCodeItem: function (tmpl, code, data, dataindex) {
            var tagO = tmpl.tags.getTags(code.command);
            if (tagO) {
                tmpl.output.push(tagO(code.fn(tmpl, code, data, dataindex)));
                tagO = null;
                return;
            };
            switch (code.command) {
                case "if":
                    if (code.end) break;
                    //console.log([code.command, code.commandparams, code.fn(tmpl, code, data, dataindex)])
                    var ifstatus = code.fn(tmpl, code, data, dataindex);
                    tmpl.ifstatus[code.level] = ifstatus;
                    if (ifstatus) {
                        $pcode.render.compile.runTmplCode(tmpl, code.children, data, dataindex);
                    }
                    ifstatus = null;
                    break;
                case "else":
                    if (tmpl.ifstatus[code.level]) break;
                    //console.log([code.command, code.commandparams, code.fn(tmpl, code, data, dataindex)])
                    var ifstatus = code.fn(tmpl, code, data, dataindex);
                    tmpl.ifstatus[code.level] = ifstatus;
                    if (ifstatus) {
                        $pcode.render.compile.runTmplCode(tmpl, code.children, data, dataindex);
                    }
                    ifstatus = null;
                    break;
                case "for":
                    var forDatas = null;
                    var parentTmplD = null;
                    if (code.end) {
                        if (code.single && code.tmpl) {
                            //console.log([code.command, code.commandparams, code.fn(tmpl, code, data, dataindex)])
                            forDatas = code.fn(tmpl, code, data, dataindex);
                            if (forDatas) {
                                code.tmpl.output = tmpl.output;
                                code.tmpl.view = tmpl.view;
                                code.tmpl.parents = tmpl.parents;
                                parentTmplD = tmpl.parent();
                                tmpl.parents.push({ data: data, parent: parentTmplD, index: dataindex });
                                parentTmplD = null;
                                code.tmpl.render(forDatas);
                                tmpl.parents.pop();
                                //$pcode.render.compile.runTmplDataList(tmpl, code.children, forDatas);
                            }
                        }
                    } else {
                        //console.log([code.command, code.commandparams, code.fn(tmpl, code, data, dataindex)])
                        forDatas = code.fn(tmpl, code, data, dataindex);
                        if (forDatas) {
                            parentTmplD = tmpl.parent();
                            tmpl.parents.push({ data: data, parent: parentTmplD, index: dataindex });
                            parentTmplD = null;
                            $pcode.render.compile.runTmplDataList(tmpl, code.children, forDatas);
                            tmpl.parents.pop();
                        }
                    }
                    forDatas = null;
                    break;
                case ":":
                    //console.log([code.type, code.commandparams, code.fn(tmpl, code, data, dataindex)])
                    return tmpl.output.push(code.fn(tmpl, code, data, dataindex));
                    break;
                case ">":
                    //console.log([code.type, code.commandparams, code.fn(tmpl, code, data, dataindex)])
                    return tmpl.output.push($pcode.htmlEncode(code.fn(tmpl, code, data, dataindex)));
                    break;
                case "<":
                    //console.log([code.type, code.commandparams, code.fn(tmpl, code, data, dataindex)])
                    return tmpl.output.push($pcode.urlEncode(code.fn(tmpl, code, data, dataindex)));
                    break;
                default:
                    //console.log([code.type, code.commandparams, code.fn(tmpl, code, data, dataindex)])
                    //return tmpl.output.push(code.fn(tmpl, code, data, dataindex));
                    break;
            }
            tmpl = code = data = null;
        }
    });

})();


(function () {
    //version 1.0.1.31
    "use strict";
    var $pcode = window.$pcode;

    $pcode.extend({
        validator: function (jqselector) {
            var jTarget = $pcode.isJquery(jqselector) ? jqselector : $(jqselector);
            if (jTarget.size() > 0) {
                $pcode.validatorClear(jTarget);
                return new $pcode.validator.ValidatorClass({ jqselector: jTarget });
            }
            else
                return null;
        },
        validatorVerify: function (jqselector) {
            var jTarget = $pcode.isJquery(jqselector) ? jqselector : $(jqselector);
            if (jTarget.size() > 0) {
                var validator = validatorManager.getValidator(jTarget);
                if (validator) {
                    return validator.verify();
                } else {
                    validator = $pcode.validator(jqselector);
                    return validator.verify();
                }
            }
            else
                return true;
        },
        validatorClear: function (jqselector) {
            var jTarget = $pcode.isJquery(jqselector) ? jqselector : $(jqselector);
            if (jTarget.size() > 0) {
                var validator = validatorManager.getValidator(jTarget);
                if (validator) {
                    return validator.clearValidation();
                }
            }
        },
        validatorRules: function (rules) {
            $pcode.extend(validatorManager.rules, rules);
            rules = null;
        },
        validatorSetting: function (setting) {
            $pcode.extend(validatorManager.defaultSetting, setting);
            setting = null;
        }
    });

    //语法:url,required[必须输入],length[1,2,长度在1到2之间]
    var _regValidator = /([^\[\]\,]+?)\[([^\]]+?)\]|([^\[\]\,]+)/g;

    var validatorManager = {
        defaultSetting: {
            inline: true,  //是否内部验证, 如果false, 不绑定事件
            eventTriggers: "change", //绑定事件
            liveEvent: false, //是否用live绑定
            //验证前响应, 返回false, 跳过验证
            onValidationBefore: function (sender, element, rules) { return true; },
            //出错时响应, 用于出错时处理显示样式等
            onError: function (sender, element, rules, errors) { },
            //成功时响应, 用于成功时处理显示样式等
            onSuccess: function (sender, element, rules) { },
            //清除Validator时响应, 用于清除时处理显示样式等
            onClearValidator: function (sender, element) { }
        },
        rules: {},
        doEvent: function (e) {
            validatorManager.validationElement(this);
            e = null;
        },
        setElementRules: function (element, rules) {
            return $(element).data("validator_rules_20130117", rules);
        },
        clearElementRules: function (element) {
            $(element).removeData("validator_rules_20130117");
        },
        getElementRules: function (element) {
            return $(element).data("validator_rules_20130117");
        },
        setErrorInfo: function (element, text, defaultText) {
            //console.log(text);
            var jElement = $(element);
            var errordata = jElement.data("validatorErrorDatas");
            if (!errordata) {
                errordata = [];
                jElement.data("validatorErrorDatas", errordata);
            }
            errordata.push($pcode.isNullEmpty(text) ? defaultText : text);
            jElement.attr("isValidatorError", "T");
            jElement = errordata = null;
        },
        getErrorInfo: function (element) {
            return $(element).data("validatorErrorDatas");
        },
        clearErrorInfo: function (element) {
            $(element).removeAttr("isValidatorError").removeData("validatorErrorDatas");
        },
        getAllErrorInfo: function (element) {
            var validator = this.getValidator(element);
            return validator ? validator.getAllErrorInfo() : [];
        },
        validationElement: function (element) {
            var oValidator = this.getValidator(element);
            this.clearErrorInfo(element);
            if (!oValidator) return;
            var rules = this.getElementRules(element);
            var errorList = null;
            try {
                if (oValidator.Event.triggerHandler("onValidationBefore", oValidator, element, rules) === false) return;
                $pcode.linq(rules)
                    .each(function () {
                        if ($pcode.isFunction(this.executor)) {
                            this.executor(oValidator, element, this);
                        }
                    });
                errorList = this.getErrorInfo(element);
                if (!errorList || errorList.length <= 0) {
                    oValidator.Event.trigger("onSuccess", oValidator, element, rules);
                } else {
                    oValidator.Event.trigger("onError", oValidator, element, rules, errorList);
                }
            }
            catch (e) {
                this.setErrorInfo(element, e.message || e);
                errorList = this.getErrorInfo(element);
                oValidator.Event.trigger("onError", oValidator, element, rules, errorList);
            }
            finally {
                element = oValidator = rules = errorList = null;
            }
        },
        setValidator: function (element, validator) {
            $(element).data("pcode_validator_20120118", validator);
            element = validator = null;
        },
        getValidator: function (element) {
            /// <summary>
            /// 
            /// </summary>
            /// <param name="element"></param>
            /// <returns type="$pcode.validator.ValidatorClass"></returns>
            return $(element).data("pcode_validator_20120118");
        },
        clearValidator: function (element) {
            return $(element).removeData("pcode_validator_20120118");
        }
    };


    $pcode.DefineClass()
        .Event({
            onValidationBefore: function (callback) {
                /// <summary>
                /// 验证前, 如果返回false中断验证
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
                /// 错误
                /// <para>sender, element, rules, errors</para>
                /// </summary>
                /// <param name="callback"></param>
                this.on("onError", callback);
                callback = null;
                return this;
            },
            onSuccess: function (callback) {
                /// <summary>
                /// 成功
                /// <para>sender, element, rules</para>
                /// </summary>
                /// <param name="callback"></param>
                this.on("onSuccess", callback);
                callback = null;
                return this;
            },
            onClearValidator: function (callback) {
                /// <summary>
                /// 成功
                /// <para>sender, element</para>
                /// </summary>
                /// <param name="callback"></param>
                this.on("onClearValidator", callback);
                callback = null;
                return this;
            }
        })
        .DefineGroup("privateValidator", {
            p: null,
            link: null,
            jTarget: null,
            onEvent: function () {
                //附加事件
                if (this.p.liveEvent) {
                    if (!$pcode.isNullEmpty(this.p.eventTriggers)) {
                        $('[validator]', this.jTarget).live(this.p.eventTriggers, validatorManager.doEvent);
                    }
                    //$('[validator][type=checkbox],[validator][type=radio]', this.jTarget).live('click', validatorManager.doEvent);
                    $('[validator][type=text],textarea[validator]', this.jTarget).live('keyup', validatorManager.doEvent);
                    $('[validator][event]', this.jTarget).each(function () {
                        var jObj = $(this);
                        jObj.live(jObj.attr('event'), validatorManager.doEvent);
                        jObj = null;
                    });
                } else {
                    if (!$pcode.isNullEmpty(this.p.eventTriggers)) {
                        $('[validator]', this.jTarget).on(this.p.eventTriggers, validatorManager.doEvent);
                    }
                    //$('[validator][type=checkbox],[validator][type=radio]', this.jTarget).on('click', validatorManager.doEvent);
                    $('[validator][type=text],textarea[validator]', this.jTarget).on('keyup', validatorManager.doEvent);
                    $('[validator][event]', this.jTarget).each(function () {
                        var jObj = $(this);
                        jObj.on(jObj.attr('event'), validatorManager.doEvent);
                        jObj = null;
                    });
                }
            },
            offEvent: function () {
                //解除事件
                //console.log(this.p.eventTriggers);
                if (this.p.liveEvent) {
                    if (!$pcode.isNullEmpty(this.p.eventTriggers)) {
                        $('[validator]', this.jTarget).die(this.p.eventTriggers, validatorManager.doEvent);
                    }
                    $('[validator]', this.jTarget).die("click", validatorManager.doEvent);
                    $('[validator][type=text],textarea[validator]', this.jTarget).die('keyup', validatorManager.doEvent);
                    $('[validator][event]', this.jTarget).each(function () {
                        var jObj = $(this);
                        jObj.die(jObj.attr('event'), validatorManager.doEvent);
                        jObj = null;
                    });
                } else {
                    if (!$pcode.isNullEmpty(this.p.eventTriggers)) {
                        $('[validator]', this.jTarget).off(this.p.eventTriggers, validatorManager.doEvent);
                    }
                    $('[validator]', this.jTarget).off("click", validatorManager.doEvent);
                    $('[validator][type=text],textarea[validator]', this.jTarget).off('keyup', validatorManager.doEvent);
                    $('[validator][event]', this.jTarget).each(function () {
                        var jObj = $(this);
                        jObj.off(jObj.attr('event'), validatorManager.doEvent);
                        jObj = null;
                    });
                }
            },
            getAllValidatoElements: function () {
                return $('[validator]', this.jTarget);
            },
            initElementrRules: function () {
                //生成规则
                var allRules = validatorManager.rules;
                this.getAllValidatoElements().each(function () {
                    var rules = [];
                    var jObj = $(this);
                    var s = jObj.attr("validator");
                    if (!$pcode.isNullEmpty(s)) {
                        s.replace(_regValidator, function (findText, rulename, ruleparam, rulename2, findPos, alltext) {
                            rulename = $pcode.trim(rulename || rulename2);
                            if (!$pcode.isNullEmpty(rulename) && allRules[rulename]) {
                                var ritem = $pcode.cloneObject(allRules[rulename]);
                                ritem.options = $pcode.linq((ruleparam && ruleparam.split(',')) || [])
                                    .select(function () { return (this && $pcode.trim(this)) || $pcode.stringEmpty; })
                                    .toArray();
                                ritem.name = rulename;
                                rules.push(ritem);
                                ritem = null;
                            }
                        });
                    }
                    validatorManager.setElementRules(jObj, rules);
                    jObj = rules = s = null;
                });
            },
            setValidatorToElements: function () {
                var $this = this.$this();
                validatorManager.setValidator(this.jTarget, $this);
                this.getAllValidatoElements().each(function () {
                    validatorManager.setValidator(this, $this);
                });
                $this = null;
            },
            clearAllValidatorStatus: function () {
                /// <summary>
                /// 清除所有
                /// </summary>
                var oValidator = this.$this();
                //console.log(oValidator);
                try {
                    this.offEvent(); //清除事件
                    validatorManager.clearValidator(this.jTarget); //清除对象
                    this.getAllValidatoElements().each(function () {
                        validatorManager.clearValidator(this); //清除对象
                        validatorManager.clearErrorInfo(this); //清除出错内容
                        validatorManager.clearElementRules(this); //清除规则
                        oValidator.Event.trigger("onClearValidator", oValidator, this);
                    });
                } finally {
                    oValidator = null;
                }
            },
            verify: function () {
                this.getAllValidatoElements().each(function () {
                    //var rules
                    validatorManager.validationElement(this);
                });
            }
        })
        .Define({
            getTarget: function () {
                /// <summary>
                /// 
                /// </summary>
                /// <returns type="jQuery"></returns>
                return this.privateValidator.jTarget;
            },
            getAllValidatoElements: function () {
                return this.privateValidator.getAllValidatoElements();
            },
            setErrorInfo: function (element, text, defaultText) {
                validatorManager.setErrorInfo(element, text, defaultText);
                element = text = null;
            },
            clearErrorInfo: function (element) {
                validatorManager.clearErrorInfo(element);
                element = null;
            },
            getAllErrorInfo: function () {
                return $pcode.linq(this.getAllValidatoElements())
                    .selectMerge(function () {
                        var errordata = validatorManager.getErrorInfo(this);
                        return errordata;
                    })
                    .where(function (item) { return !$pcode.isNull(item); })
                    .toArray();
            },
            verify: function () {
                this.privateValidator.verify();
                var errors = this.getAllErrorInfo();
                //console.log(errors);
                return (errors.length <= 0)
            },
            clearValidation: function () {
                //console.log("clearValidation");
                $pcode.disconnectToDom(this.privateValidator.link);
                this.privateValidator.clearAllValidatorStatus();
            }
        })
        .Init(function (p) {
            //console.log(JSON.stringify(p));
            p = $pcode.extend({}, validatorManager.defaultSetting, p || {});
            this.privateValidator.p = p;
            //console.log(p);

            var jTarget = $pcode.isJquery(p.jqselector) ? p.jqselector : $(p.jqselector);
            this.privateValidator.jTarget = jTarget;

            this.Event.onDispose(function () {
                //console.log("remove validator");
                p = jTarget = null;
            });
            //console.log([p.jqselector, jTarget.size()]);
            this.privateValidator.link = this.linkToDom(jTarget);
            if (jTarget.size() <= 0) return;

            if (p.inline) {
                this.privateValidator.onEvent();
            }

            this.privateValidator.initElementrRules();
            this.privateValidator.setValidatorToElements();

            this.Event
                .onValidationBefore(p.onValidationBefore)
                .onError(p.onError)
                .onSuccess(p.onSuccess)
                .onClearValidator(p.onClearValidator);

        })
        .Class("$pcode.validator.ValidatorClass");


})();