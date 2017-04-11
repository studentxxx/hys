var scroll =
    (function scroll(obj) {

        var def = {
            name: 'scroll',
            onScroll: 'on',
            ulCss: {
                position: 'fixed',
                right: '20px',
                top: '50%',
                width: '25px',
                backgroundColor: '#fff',
                color: '#000',
                padding: '5px'
            },
            liCss: {
                width: '100%',
                height: '25px',
                textAlign: 'center',
                lineHeight: '25px',
                backgroundColor: '#fff',
                color: '#000',
                marginBottom: '3px',
                cursor: 'pointer'
            },
            current: {
                backgroundColor: 'red',
                color: 'white'
            },
            extend: function(obj) {
                for (var k in obj) {
                    def[k] = obj[k];
                }
            }
        };
        //初始化参数
        def.extend(obj);

        //根据标记要滑动的块的个数 创建相应的ul与li  并添加上默认样式
        var section = getByClass(def.name, document.body);
        var length = section.length;
        if (length === 0) {
            return false;
        } else {
            var ul = cE('ul', {
                css: def.ulCss
            });
            for (var i = 0; i < length; i++) {
                ul.appendChild(cE('li', {
                    innerHTML: (i + 1) + '',
                    index: i,
                    css: def.liCss
                }));
            }
            document.body.appendChild(ul);
        }


        //给ul绑定事件委托 点击相应的li 跳转到相应的模块
        var index = 0;

        ul.onclick = function(event) {
            var event = event || window.event;
            var target = event.target || event.srcElement;
            index = target.index;
            if (index + 1) {
                sTo(index);
            }
        }

        // 若onScroll的值为on 注册window.onscroll事件 翻到相应的页面 对应的li亮起
        var lis = ul.getElementsByTagName('li');
        if (def.onScroll === 'on') {
            current(0);
            window.onscroll = function() {
                var dis = document.body.scrollTop || window.pageYOffset || document.documentElement.scrollTop;
                for (var i = 0; i < lis.length; i++) {
                    if (dis >= section[i].offsetTop) {
                        current(i);
                    }
                }
            };
        }
        var flag = true;

        function sTo(index) {
            if (flag) {
                flag = false;
                sTo.timer = setInterval(function() {
                    var current = document.body.scrollTop || window.pageYOffset || document.documentElement.scrollTop;
                    var target = section[index].offsetTop;
                    var speed = (target - current) / 10;
                    speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);
                    window.scrollTo(0, current + speed);
                    if (current === target) {
                        clearInterval(sTo.timer);
                        flag = true;
                    }
                }, 15)
            }
        };

        function current(index) {
            for (var i = 0; i < lis.length; i++) {
                for (var k in def.liCss) {
                    lis[i].style[k] = def.liCss[k];
                }
            }
            for (var k in def.current) {
                lis[index].style[k] = def.current[k];
            }
        };

        function getByClass(className, node) {
            var arr = [];
            var tags = node;
            for (var i = 0, max = tags.children.length; i < max; i++) {
                if (tags.children[i].className.indexOf(className) !== -1) {
                    arr.push(tags.children[i]);
                }
                var temp = arguments.callee(className, tags.children[i]);
                arr = arr.concat(temp);
            }
            return arr;
        };

        function cE(tag, attr) {
            var that = document.createElement(tag);
            if (attr) {
                for (var k in attr) {
                    if (k === 'css') {
                        for (var style in attr[k]) {
                            that.style[style] = attr[k][style];
                        }
                    }
                    that[k] = attr[k];
                }
            }
            return that;
        };

        //提供重新设置li中文本的方法
        scroll.setLi = function(arr) {
            if (arr) {
                for (var i = 0; i < lis.length; i++) {
                    lis[i].innerHTML = arr[i];
                }
            }
        };

        function addScrollEvent(fun) {
            var oldScrollEvent = window.onscroll;
            if (oldScrollEvent) {
                window.onscroll = function() {
                    oldScrollEvent();
                    fun();
                }
            } else {
                window.onscroll = fun;
            }
        }
        return scroll;
    });