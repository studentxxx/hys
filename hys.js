(function(window, undefined) {
    var push = [].push;
    try {
        var div = document.createElement('div'),
            test = [];
        div.innerHTML('<p></p>');
        push.apply(test, div.getElementsByTagName('p'));
    } catch (e) {
        push = {
            apply: function(arr1, arr2) {
                for (var i = 0; i < arr2.length; i++) {
                    arr1[arr1.length++] = arr2[i];
                };
            }
        };
    }

    function _(data) {
        return new _.prototype.init(data);
    };
    _.prototype = {
        length: 0,
        hys: 'hahaha',
        constructor: _,
        init: function(data) {
            if (_.isString(data)) {
                if (_.isHTMLStr(data)) {
                    push.apply(this, _.parseHTML(data));
                    return;
                } else {
                    push.apply(this, _.select(data));
                    return;
                }
            } else if (_.isDom(data)) {
                [].push.call(this, data);
                return;
            } else if (_.isArrayLike(data)) {
                push.apply(this, data);
                return;
            } else if (_.isFunction(data)) {
                var oldLoad = window.onload ? window.onload : null,
                    newLoad = data;
                window.onload = function() {
                    if (oldLoad) {
                        oldLoad();
                    }
                    newLoad();
                }
            }
        }
    }

    _.fn = _.prototype.init.prototype = _.prototype;

    _.fn.extend = _.extend = function(obj) {
        for (var k in obj) {
            this[k] = obj[k];
        }
    }

    //兼容模块
    var support =
        (function() {
            var support = {},
                rNative = /\{\s*\[native/,
                div = document.createElement('div');
            div.className = 'c';
            support.addEventListener = rNative.test(document.addEventListener + '');
            support.getComputedStyle = rNative.test(window.getComputedStyle + '');
            support.classList = div.classList !== undefined;
            support.getElementsByClassName = rNative.test(document.getElementsByClassName + '');
            support.qsa = rNative.test(document.querySelectorAll + '');
            support.indexOf = rNative.test(Array.prototype.indexOf + '');
            support.trim = rNative.test(String.prototype.trim + '');
            return support;
        })();



    //选择器模块
    var select =
        (function() {
            var support = {},
                rTrim = /^(\s+)|(\s+)$/g,
                rBase = /^(?:\#([\w\-]+)|\.([\w\-]+)|(\*)|(\w+))$/;

            function select(selector, arr) {
                if (support.qsa) {
                    return document.querySelectorAll(selector);
                } else {
                    arr = arr || [];
                    if (typeof selector === 'string') {
                        selector = _.myTrim(selector);
                        var selectors = selector.split(',');
                        for (var i = 0; i < selectors.length; i++) {
                            push.apply(arr, select2(selectors[i]));
                        }
                    }
                    return unique(arr);
                }
            }

            function select2(selector, node, arr) {
                arr = arr || [];
                node = node || document;
                var nodeArr = [node],
                    res = [];
                var baseSelect = _.myTrim(selector).split(' ');
                for (var i = 0; i < baseSelect.length; i++) {
                    for (var j = 0; j < nodeArr.length; j++) {
                        push.apply(res, basicSelect(baseSelect[i], nodeArr[j]));
                    }
                    nodeArr = res;
                    res = [];
                }
                push.apply(arr, nodeArr);
                return arr;
            }

            function getByTag(tagName, node, arr) {
                arr = arr || [];
                node = node || document;
                push.apply(arr, node.getElementsByTagName(tagName));
                return arr;
            }

            function getById(idName, arr) {
                arr = arr || [];
                arr.push(document.getElementById(idName));
                return arr;
            }


            function basicSelect(selector, node, arr) {
                node = node || document;
                arr = arr || [];
                var m = rBase.exec(selector);
                if (m[1] && (ele = document.getElementById(m[1]))) {
                    arr.push(ele);
                } else if (m[2]) {
                    push.apply(arr, _.getByClass(m[2], node));
                } else if (m[3]) {
                    push.apply(arr, getByTag(m[3], node));
                } else {
                    push.apply(arr, getByTag(m[4], node));
                }
                return arr;
            }

            function unique(arr) {
                var res = [];
                for (var i = 0; i < arr.length; i++) {
                    if (_.myIndexOf(res, arr[i]) === -1) {
                        res.push(arr[i]);
                    }
                }
                return res;
            }
            return select;
        })();
    _.select = select;

    //功能函数
    var rTrim = /^(\s+)|(\s+)$/g;
    _.extend({
        each: function(obj, func) {
            var i;
            if (obj instanceof Array || obj.length >= 0) {
                for (i = 0; i < obj.length; i++) {
                    func.call(obj[i], i, obj[i]);
                }
            } else {
                for (i in obj) {
                    func.call(obj[i], i, obj[i]);
                }
            }
        },
        map: function(obj, func) {
            var i, res = [];
            if (obj instanceof Array || obj.length >= 0) {
                for (i = 0; i < obj.length; i++) {
                    var temp = func.call(obj[i], obj[i], i);
                    if (temp != null) {
                        res.push(temp);
                    }
                }
            } else {
                for (i in obj) {
                    var temp = func.call(obj[i], obj[i], i);
                    if (temp != null) {
                        res.push(temp);
                    }
                }
            }
            return res;
        },
        isString: function(str) {
            return typeof str === 'string';
        },
        isArrayLike: function(arr) {
            if ((arr.length >= 0 || arr instanceof Array) && typeof arr !== 'function') {
                return true;
            } else {
                return false;
            }
        },
        isFunction: function(fn) {
            return typeof fn === 'function';
        },
        isHTMLStr: function(str) {
            return /^</.test(str);
        },
        isDom: function(dom) {
            if (!!dom.tagName) {
                return true;
            } else {
                return false;
            }
        },
        ishys: function(obj) {
            if (obj.constructor === _ && obj.hys === 'hahaha') {
                return true;
            } else {
                return false;
            }
        },
        myIndexOf: function(arr, search, start) {
            start = start || 0;
            for (var i = start; i < arr.length; i++) {
                if (arr[i] === search) {
                    return i;
                }
            }
            return -1;
        },
        myTrim: function(str) {
            if (support.trim) {
                return str.trim();
            } else {
                var newStr = str.replace(rTrim, '');
                return newStr;
            }
        },
        removeItem: function(arr, item) {
            var res = null;
            if (_.isArrayLike(arr)) {
                res = [];
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i] !== item) {
                        res.push(arr[i]);
                    }
                }
            } else if (typeof arr === 'object') {
                for (var k in arr) {
                    if (arr[k] !== item) {
                        res[k] = arr[k];
                    }
                }
            }
            return res;
        },
        getByClass: function(className, node, arr) {
            arr = arr || [];
            node = node || document;
            if (support.getElementsByClassName) {
                push.apply(arr, node.getElementsByClassName(className));
            } else {
                var eles = document.getElementsByTagName('*');
                for (var i = 0; i < eles.length; i++) {
                    if (eles[i].className === className) {
                        arr.push(eles[i]);
                    }
                }
            }
            return arr;
        },
        parseHTML: function(str, node) {
            var res = [];
            node = node || document.createElement('div');
            node.innerHTML = str;
            for (var i = 0; i < node.childNodes.length; i++) {
                res.push(node.childNodes[i]);
            }
            return res;
        },
        getStyle: function(ele, style) {
            if (support.getComputedStyle) {
                return window.getComputedStyle(ele, null)[style];
            } else {
                return ele.currentStyle[style];
            }
        },
        ajax: function(obj) {
            var defaults = {
                type: 'get',
                url: '#',
                data: {},
                dataType: 'text',
                async: true,
                jsonp: 'callback',
                jsonpCallback: 'hys' + ('1.0' + Math.random()).replace(/\D/g, '') + '_' + new Date().getTime(),
                success: function() {},
                extend: function(obj) {
                    for (var k in obj) {
                        this[k] = obj[k];
                    };
                }
            };
            defaults.extend(obj);
            if (defaults.dataType === 'jsonp') {
                var param = '';
                if (JSON.stringify(defaults.data) !== "{}") {
                    for (var k in defaults.data) {
                        param += '&' + k + '=' + defaults.data[k];
                    }
                }
                window[defaults.jsonpCallback] = function(data) {
                    defaults.success(data);
                }
                var s = document.createElement('script');
                s.src = defaults.url + '?' + defaults.jsonp + '=' + defaults.jsonpCallback + param;
                document.body.appendChild(s);
            } else {
                var xhr = null;
                if (window.XMLHttpRequest) {
                    xhr = new XMLHttpRequest();
                } else {
                    xhr = new ActiveXObject('Microsoft.XMLHttp');
                }
                if (defaults.type === 'get') {
                    var param = defaults.url + '?';
                    if (JSON.stringify(defaults.data) !== "{}") {
                        for (var k in defaults.data) {
                            param += k + '=' + defaults.data[k] + '&';
                        }
                    }
                    param = param.substring(0, param.length - 1);
                    xhr.open(defaults.type, param, defaults.async);
                    xhr.send(null);
                } else if (defaults.type === 'post') {
                    xhr.open(defaults.type, defaults.url, defaults.async);
                    var param = '';
                    if (JSON.stringify(defaults.data) !== "{}") {
                        for (var k in defaults.data) {
                            param += k + '=' + defaults.data[k] + '&';
                        }
                    }
                    param = param.substring(0, param.length - 1);
                    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                    xhr.send(param);
                }
                xhr.onreadystatechange = function() {
                    if (xhr.readyState === 4 && xhr.status === 200) {
                        var data = '';
                        if (defaults.dataType === 'json') {
                            data = JSON.parse(xhr.responseText);
                        }
                        defaults.success(data);
                    } else {
                        if (defaults.error) {
                            defaults.error();
                        }
                    }
                }
            }
        },
        easing: {
            linear: function(x, t, b, c, d) {
                return (c - b) / d * t;
            },
            swing: function(x, t, b, c, d) {
                return ((-Math.cos(t * Math.PI) / 2) + 0.5) * d + b;
            },
            speedUp: function(x, t, b, c, d) {
                return (c - b) / (d * d) * t * t;
            },
            speedDown: function(x, t, b, c, d) {
                return 2 * (c - b) / d * t - (c - b) / (d * d) * t * t;
            },
            extend: _.extend
        }

    })

    //dom操作
    var dom = {
        get: function(num) {
            var arr = [];
            for (var i = 0; i < this.length; i++) {
                arr.push(this[i]);
            }
            if (num === undefined) {
                return arr;
            } else if (typeof num === 'number') {
                return arr[num];
            }
        },
        eq: function(num) {
            if (typeof num === 'number') {
                if (num >= 0) {
                    var res = _(this.get(num));
                    res.prevObj = this;
                    return res;
                } else if (num < 0) {
                    var res = _(this.get(this.length + num));
                    res.prevObj = this;
                    return res;
                }
            }
            return this;
        },
        end: function() {
            if (_.ishys(this) && this.prevObj) {
                return this.prevObj;
            }
        },
        appendTo: function(obj) {
            var parents = null,
                res = [];
            if (_.ishys(obj)) {
                parents = obj;
            } else if (_.isDom(obj)) {
                parents = _(obj);
            } else if (typeof obj === 'string') {
                parents = _.select(obj);
            }
            for (var j = 0; j < parents.length; j++) {
                for (var i = 0; i < this.length; i++) {
                    if (j === parents.length - 1) {
                        res.push(this[i]);
                        parents[j].appendChild(this[i]);
                    } else {
                        var temp = this[i].cloneNode(true);
                        res.push(temp);
                        parents[j].appendChild(temp);
                    }
                }
            }
            res = _(res);
            res.prevObj = _(res[0]);
            return res;
        },
        append: function(obj) {
            _(obj).appendTo(this);
            return this;
        },
        remove: function() {
            this.each(function(i, v) {
                v.parentNode.removeChild(v);
            })
            return this;
        },
        html: function(str) {
            if (str !== undefined) {
                this.each(function(i, v) {
                    v.innerHTML = str;
                });
            } else if (this.length >= 1) {
                return this[0].innerHTML;
            }
            return this;
        },
        text: function(str) {
            if (_.ishys(this) && str) {
                this.each(function(i, v) {
                    v.innerHTML = str;
                });
            } else if (str === undefined && _.ishys(this) && this.length >= 1) {
                str = '';
                this.each(function(i, v) {
                    (function(v) {
                        var nodes = v.childNodes;
                        for (var i = 0; i < nodes.length; i++) {
                            if (nodes[i].nodeType === 3) {
                                str += nodes[i].nodeValue;
                            } else if (nodes[i].nodeType === 1) {
                                arguments.callee(nodes[i]);
                            }
                        }
                    })(v);
                });
                return str;
            }
            return this;
        },
        parent: function() {
            var res = [];
            this.each(function(i, v) {
                res.push(v.parentNode);
            });
            res = _(res);
            res.prevObj = this;
            return res;
        },
        parents: function(selector) {
            var node = null,
                res = [];
            this.each(function(i, v) {
                node = v;
                do {
                    node = node.parentNode;
                    res.push(node);
                    if (node === document.documentElement) {
                        break;
                    }
                } while (true);
            });
            res = (function(arr) {
                var res = [];
                for (var i = 0; i < arr.length; i++) {
                    if (_.myIndexOf(res, arr[i]) === -1) {
                        res.push(arr[i]);
                    }
                }
                return res;
            }(res));
            if (selector === undefined) {
                res = _(res);
                res.prevObj = this;
                return res;
            } else {
                var parents = _.select(selector),
                    res2 = [];
                for (var i = 0; i < parents.length; i++) {
                    for (var j = 0; j < res.length; j++) {
                        if (res[j] === parents[i]) {
                            res2.push(parents[i]);
                        }
                    }
                };
                res = _(res2);
                res.prevObj = this;
                return res;
            }
        },
        children: function(selector) {
            var res = [],
                nodes = null,
                children = [];
            this.each(function(i, v) {
                nodes = v.childNodes;
                for (var i = 0; i < nodes.length; i++) {
                    if (nodes[i].nodeType === 1) {
                        res.push(nodes[i]);
                    }
                }
            });
            if (selector === undefined) {
                res = _(res);
                res.prevObj = this;
                return res;
            } else {
                var that = this,
                    res2 = [],
                    search = function(arr1, arr2) {
                        var res = [];
                        for (var i = 0; i < arr1.length; i++) {
                            for (var j = 0; j < arr2.length; j++) {
                                if (_.myIndexOf(_(arr1[i]).parent(), arr2[j]) !== -1) {
                                    res.push(arr1[i]);
                                }
                            }
                        }
                        return res;
                    };
                push.apply(children, _.select(selector));
                for (var i = 0; i < children.length; i++) {
                    for (var j = 0; j < res.length; j++) {
                        if (children[i] === res[j]) {
                            res2.push(res[j]);
                        }
                    }
                }
                res = _(res2);
                res.prevObj = this;
                return res;
            }
            return this;
        },
        siblings: function(selector) {
            var res = [],
                that = this;
            push.apply(res, this.parent().children(selector));
            res = (function(arr) {
                var res = [];
                for (var i = 0; i < arr.length; i++) {
                    if (_.myIndexOf(res, arr[i]) === -1 && _.myIndexOf(that, arr[i]) === -1) {
                        res.push(arr[i]);
                    }
                }
                return res;
            })(res);
            res = _(res);
            res.prevObj = this;
            return res;
        },
        find: function(selector) {
            var res = [],
                nodes = [],
                children = [];
            if (selector !== undefined) {
                var that = this,
                    search = function(arr1, arr2) {
                        var res = [];
                        for (var i = 0; i < arr1.length; i++) {
                            for (var j = 0; j < arr2.length; j++) {
                                if (_.myIndexOf(_(arr1[i]).parents(), arr2[j]) !== -1) {
                                    res.push(arr1[i]);
                                }
                            }
                        }
                        return res;
                    };
                push.apply(children, _.select(selector));
                for (var i = 0; i < children.length; i++) {
                    push.apply(res, search(children, that));
                }
                res = (function(arr) {
                    var res = [];
                    for (var i = 0; i < arr.length; i++) {
                        if (_.myIndexOf(res, arr[i]) === -1) {
                            res.push(arr[i]);
                        }
                    }
                    return res;
                }(res));

                res = _(res);
                res.prevObj = this;
                return res;
            }
            return this;
        },
        prev: function() {
            var res = [],
                node = this[0];
            do {
                if (node && node.previousSibling) {
                    node = node.previousSibling;
                } else {
                    break;
                }
                if (node.nodeType === 1 || !node) {
                    res = _(node);
                    res.prevObj = this;
                    break;
                }
            } while (true);
            res = _(res);
            res.prevObj = this;
            return res;
        },
        next: function() {
            var res = [],
                node = this[0];
            do {
                if (node && node.nextSibling) {
                    node = node.nextSibling;
                } else {
                    break;
                }
                if (node.nodeType === 1 || !node) {
                    res = _(node);
                    res.prevObj = this;
                    break;
                }

            } while (true);
            res = _(res);
            res.prevObj = this;
            return res;
        },
        index: function() {
            var children = this.parent().children(),
                that = this[0];
            for (var i = 0; i < children.length; i++) {
                if (children[i] === that) {
                    return i;
                }
            }
        }

    };
    _.fn.extend(dom);

    //属性及样式操作
    var attr = {
        css: function(data, attr) {
            if (typeof data === 'object') {
                return this.each(function(i, v) {
                    for (var k in data) {
                        if (k === 'height' || k === 'width') {
                            v.style[k] = parseInt(data[k]) + 'px';
                            continue;
                        }
                        v.style[k] = data[k];
                    }
                });
            } else if (typeof data === 'string') {
                if (arguments.length === 1) {
                    return _.getStyle(this[0], data);
                } else if (arguments.length === 2) {
                    this.each(function(i, v) {
                        if (data === 'height' || data === 'width') {
                            v.style[data] = parseInt(attr) + 'px';
                        } else {
                            v.style[data] = attr;
                        }
                    })
                }
            }
            return this;
        },
        hasClass: function(str) {
            var that = null,
                flag = false;
            if (str === undefined) {
                return this;
            } else if (typeof str === 'string') {
                for (var j = 0; j < this.length; j++) {
                    that = this[j];
                    var classList = that.className.split(' '),
                        str = _.myTrim(str);
                    for (var i = 0; i < classList.length; i++) {
                        if (_.myTrim(classList[i]) === str) {
                            flag = true;
                            break;
                        }
                    }
                }
            }
            return flag;
        },
        addClass: function(str) {
            for (var i = 0; i < this.length; i++) {
                var that = this[i];
                if (typeof str === 'string') {
                    if (support.classList) {
                        that.classList.add(str);
                    } else {
                        if (!_(that).hasClass(str)) {
                            that.className += (' ' + str);
                        }
                    }
                }
            }
            return this;
        },
        removeClass: function(str) {
            var that = null;
            for (var i = 0; i < this.length; i++) {
                that = this[i];
                if (str === undefined) {
                    that.className = '';
                    continue;
                }
                if (typeof str === 'string') {
                    if (support.classList) {
                        that.classList.remove(str);
                    } else {
                        var length = str.length,
                            classList = that.className.split(' '),
                            arr = [];
                        var sIndex = _.myIndexOf(classList, str);
                        if (sIndex === -1) {
                            continue;
                        } else {
                            classList.splice(sIndex, 1);
                            that.className = classList.join(' ');
                        }
                    }
                }
            }
            return this;
        },
        toggleClass: function(str) {
            if (this.hasClass(str)) {
                this.removeClass(str);
            } else {
                this.addClass(str);
            }
            return this;
        },
        offset: function() {
            if (_.ishys(this) && this.length === 1) {
                return {
                    top: this[0].offsetTop,
                    left: this[0].offsetLeft
                }
            }
            return this;
        },
        attr: function(key, value) {
            if (_.ishys(this)) {
                this.each(function(i, v) {
                    if (value === undefined) {
                        return v.getAttribute(key);
                    } else {
                        v.setAttribute(key, value);
                    }
                })
            }
            return this;
        },
        val: function(value) {
            var res = null;
            this.each(function(i, v) {
                if (value === undefined) {
                    res = v.value;
                    return;
                } else {
                    v.value = value;
                }
            });
            if (value === undefined) {
                return res;
            }
            return this;
        },
        height: function(value) {
            if (value === undefined) {
                return parseInt(this.css('height'));
            } else {
                this.css('height', value);
            }
            return this;
        },
        width: function(value) {
            if (value === undefined) {
                return parseInt(this.css('width'));
            } else {
                this.css('width', value);
            }
            return this;
        }

    };
    _.fn.extend(attr);

    //事件处理
    var event =
        (function() {
            var eventObj = {},
                event = {
                    on: function(type, callback) {
                        if (support.addEventListener) {
                            this.each(function(i, v) {
                                if (!eventObj[v]) {
                                    eventObj[v] = {};
                                }
                                eventObj[v].arr = eventObj[v].arr ? eventObj[v].arr : [];
                                v.removeEventListener(type, eventObj[v].fn);
                                eventObj[v].arr.push({
                                    type: type,
                                    callback: callback
                                });
                                eventObj[v].fn = function(event) {
                                    var that = this,
                                        flag = true;
                                    for (var i = 0; i < eventObj[v].arr.length; i++) {
                                        if (eventObj[v].arr[i].type === type) {
                                            flag = eventObj[v].arr[i].callback.call(that, event);
                                        }
                                    }
                                    if (flag === false) {
                                        try {
                                            event.stopPropagation();
                                            event.preventdefalut();
                                        } catch (e) {
                                            event.cancelBubble = true;
                                            window.event.returnValue = false;
                                        }
                                    }
                                };
                                v.addEventListener(type, eventObj[v].fn);
                            })
                        } else {
                            this.each(function(i, v) {
                                if (!eventObj[v]) {
                                    eventObj[v] = {};
                                }
                                eventObj[v].arr = eventObj[v].arr ? eventObj[v].arr : [];
                                if (eventObj[v].fn) {
                                    v.detachEvent('on' + type, eventObj[v].fn);
                                }
                                eventObj[v].arr.push({
                                    type: type,
                                    callback: callback
                                });
                                eventObj[v].fn = function(event) {
                                    var that = this,
                                        flag = true;
                                    event = event || window.event;
                                    event.target = event.srcElement ? event.srcElement : event.target;
                                    for (var i = 0; i < eventObj[v].arr.length; i++) {
                                        if (eventObj[v].arr[i].type === type) {
                                            flag = eventObj[v].arr[i].callback.call(that, event);
                                        }
                                    }
                                    if (flag === false) {
                                        try {
                                            event.stopPropagation();
                                            event.preventdefalut();
                                        } catch (e) {
                                            event.cancelBubble = true;
                                            window.event.returnValue = false;
                                        }
                                    }
                                };
                                v.attachEvent('on' + type, eventObj[v].fn);
                            })
                        }
                        return this;
                    },
                    off: function(type, callback) {
                        if (support.addEventListener) {
                            this.each(function(i, v) {
                                if (!eventObj[v]) {
                                    eventObj[v] = {};
                                }
                                v.removeEventListener(type, eventObj[v].fn);
                                for (var i = 0; i < eventObj[v].arr.length; i++) {
                                    if (eventObj[v].arr[i].callback === callback && eventObj[v].arr[i].type === type) {
                                        eventObj[v].arr.splice(i, 1);
                                        i--;
                                    }
                                };
                                eventObj[v].fn = function(event) {
                                    var that = this,
                                        flag = true;
                                    for (var i = 0; i < eventObj[v].arr.length; i++) {
                                        if (eventObj[v].arr[i].type === type) {
                                            flag = eventObj[v].arr[i].callback.call(that, event);
                                        }
                                    }
                                    if (flag === false) {
                                        try {
                                            event.stopPropagation();
                                            event.preventdefalut();
                                        } catch (e) {
                                            event.cancelBubble = true;
                                            window.event.returnValue = false;
                                        }
                                    }
                                };
                                v.addEventListener(type, eventObj[v].fn);
                            });
                        } else {
                            this.each(function(i, v) {
                                if (!eventObj[v]) {
                                    eventObj[v] = {};
                                }
                                eventObj[v].arr = eventObj[v].arr ? eventObj[v].arr : [];
                                if (eventObj[v].fn) {
                                    v.detachEvent('on' + type, eventObj[v].fn);
                                }
                                for (var i = 0; i < eventObj[v].arr.length; i++) {
                                    if (eventObj[v].arr[i].callback === callback && eventObj[v].arr[i].type === type) {
                                        eventObj[v].arr.splice(i, 1);
                                        i--;
                                    }
                                };
                                eventObj[v].fn = function(event) {
                                    var that = this,
                                        flag = true;
                                    event = event || window.event;
                                    event.target = event.srcElement ? event.srcElement : event.target;
                                    for (var i = 0; i < eventObj[v].arr.length; i++) {
                                        if (eventObj[v].arr[i].type === type) {
                                            flag = eventObj[v].arr[i].callback.call(that, event);
                                        }
                                    }
                                    if (flag === false) {
                                        try {
                                            event.stopPropagation();
                                            event.preventdefalut();
                                        } catch (e) {
                                            event.cancelBubble = true;
                                            window.event.returnValue = false;
                                        }
                                    }
                                };
                                v.attachEvent('on' + type, eventObj[v].fn);
                            })
                        }
                        return this;
                    }
                }
            _.each(("blur focus focusin focusout load resize scroll unload click dblclick " +
                "mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
                "change select submit keydown keypress keyup error contextmenu").split(' '), function(i, v) {
                event[v] = function(callback) {
                    return this.on(v, callback);
                }
            });
            event.hover = function(fnOver, fnOut) {
                return this.mouseover(fnOver).mouseout(fnOut || fnOver);
            };

            return event;
        })();
    _.fn.extend(event);

    //数组操作
    _.fn.extend({
        each: function(func) {
            var i;
            if (_.isArrayLike(this)) {
                for (i = 0; i < this.length; i++) {
                    func.call(this[i], i, this[i]);
                }
            } else {
                for (i in this) {
                    func.call(this[i], i, this[i]);
                }
            }
            return this;
        },
        map: function(func) {
            var i, res = [];
            if (_.isArrayLike(this)) {
                for (i = 0; i < this.length; i++) {
                    var temp = func.call(this[i], i, this[i]);
                    if (temp != null) {
                        res.push(temp);
                    }
                }
            } else {
                for (i in obj) {
                    var temp = func.call(this[i], i, this[i]);
                    if (temp != null) {
                        res.push(temp);
                    }
                }
            }
            return res;
        }
    })

    //动画模块
    var animate = {
        animate: function(json, speed, easing, callback) {
            //若该对象在动画中 结束函数
            if (this.isAnimate) {
                return this;
            }
            for (var i = 0; i < arguments.length; i++) {
                if (typeof arguments[i] === 'function') {
                    callback = arguments[i];
                } else if (typeof arguments[i] === 'number') {
                    speed = arguments[i];
                }
            }
            easing = easing || 'linear';
            speed = speed || 500;
            callback = undefined || callback;
            var that = this;

            //实现hys('html,body')的scrollTop缓动效果
            if (this[0] === document.documentElement && this[1] === document.body && json['scrollTop'] !== null) {

                var start = document.documentElement.scrollTop || document.body.scrollTop || window.pageYoffset || 0;
                this.startTime = +new Date();
                this.isAnimate = true;
                clearInterval(this.timer);
                this.timer = setInterval(function() {
                    var t = (+new Date()) - that.startTime;
                    if (t >= speed) {
                        clearInterval(that.timer);
                        that.isAnimate = false;
                        that.timer = null;
                        that.startTime = null;
                        t = speed;
                        if (callback) {
                            callback();
                        }
                    }
                    window.scrollTo(0, parseInt(start) + _.easing[easing](null, t, parseInt(start), Number(json['scrollTop']), speed));
                }, 15);
                return this;
            }

            //其他属性时
            var hyss = {};
            this.each(function(i, v) {
                clearInterval(v.timer);
                hyss[i] = _(v);
                for (var k in json) {
                    if (k === 'opacity') {
                        hyss[i][k] = Number(_.getStyle(v, k));
                    } else {
                        hyss[i][k] = parseInt(_.getStyle(v, k));
                    }
                }
            });
            //把参数私有化 防止同时有两个hys对象做动画时  互相影响
            this.startTime = +new Date();
            this.isAnimate = true;
            this.each(function(i, v) {
                v.timer = setInterval(function() {
                    var t = (+new Date()) - that.startTime;
                    if (t >= speed) {
                        //结束时 清除定时器 并把添加的参数清除 有回调函数 执行回调函数
                        clearInterval(v.timer);
                        that.isAnimate = false;
                        v.timer = null;
                        that.startTime = null;
                        t = speed;
                        if (callback) {
                            callback();
                        }
                    }
                    //调用备选的公式计算当前时间对应的属性值
                    for (var k in json) {
                        if (k === 'opacity') {
                            v.style[k] = hyss[i][k] + _.easing[easing](null, t, hyss[i][k], json[k], speed);
                        } else {
                            v.style[k] = hyss[i][k] + _.easing[easing](null, t, hyss[i][k], parseInt(json[k]), speed) + 'px';
                        }
                    }
                }, 15)
            })
            return this;
        },
        fadeIn: function(time, callback) {
            var that = this;
            this.each(function(i, v) {
                v.style.display = 'block';
            });
            if (!time) {
                return this;
            }
            return this.animate({
                opacity: 1,
            }, time, 'linear', callback);
        },
        fadeOut: function(time, callback) {
            var that = this;
            if (!time) {
                return this.each(function(i, v) {
                    v.style.display = 'none';
                })
            }
            return this.animate({
                opacity: 0,
            }, time, 'linear', function() {
                that.each(function(i, v) {
                    v.style.display = 'none';
                })
                if (callback) {
                    callback();
                }
            })

        },
        hide: function(time, callback) {
            var that = this;
            this.each(function(i, v) {
                v.w = _(v).width();
                v.h = _(v).height();
            })
            return this.animate({
                width: 0,
                height: 0,
                opacity: 0
            }, time, 'linear', function() {
                that.each(function(i, v) {
                    v.style.display = 'none';
                })
                if (callback) {
                    callback();
                }
            })
        },
        show: function(time, callback) {
            return this.each(function(i, v) {
                v.style.display = 'block';
                _(v).animate({
                    width: v.w,
                    height: v.h,
                    opacity: 1
                }, time, 'linear', function() {
                    v.w = null;
                    v.h = null;
                    if (callback) {
                        callback();
                    }
                })
            })
        },
        slideUp: function(time, callback) {
            return this.each(function(i, v) {
                v.h = _(v).height();
                _(v).animate({
                    height: 0
                }, time, 'linear', function() {
                    v.style.display = 'none';
                    if (callback) {
                        callback();
                    }
                })
            })
        },
        slideDown: function(time, callback) {
            var that = this;
            return this.each(function(i, v) {
                v.style.display = 'block';
                _(v).animate({
                    height: v.h
                }, time, 'linear', function() {
                    v.h = null;
                    if (callback) {
                        callback();
                    }
                });
            })
        }

    }
    _.fn.extend(animate);

    window.hys = window._ = _;
})(window);