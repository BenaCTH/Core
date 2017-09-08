(function ($$, $) {
    var
        close = [],
        eventNameSpace = '.auicommonevent',
        method,
        onCloseWidget = [];

    $('html').on("mousedown" + eventNameSpace, function (e) {
        if(!(e.originalEvent.target.getAttribute('data-close')=="prevent")){
            executeEvent(close, "mousedown");
        }
    }).on("mousewheel" + eventNameSpace, function (e) {
        if(!(e.originalEvent.target.getAttribute('data-close')=="prevent")){
            executeEvent(close, "mousewheel");
        }
    });

    function executeEvent(events, type) {
        var
            i,
            cur,
            c = events.length;

        for (i = 0; i < c; i++) {
            cur = events[i];
            if (cur && $.isFunction(cur.element[cur.widget])) {
                if (cur.except !== true) {
                    //只在popup打开的时候触发回调。
                    if (cur.visibility === true && cur.lock !== true) {
                        cur.element[cur.widget](cur.method);
                    }
                } else {
                    cur.except = false;
                }

            }
        }
    }

    method = {
        //获取已经注册过close事件的控件的名称
        onCloseWidget: function () {
            return onCloseWidget.toLocaleString();
        },
        /**
         * 注册close事件
         * @param {JQuery} element 注册close事件的控件宿主
         * @param {string} widget 控件名称
         * @param {string} method close事件生效时调用的回调函数
         */
        close: function (element, widget, method) {
            close[close.length] = {
                element: element,
                widget: widget,
                method: method
            }
            element.data("auiCloseIndex", close.length - 1);
            onCloseWidget[onCloseWidget.length] = widget;
        },
        //注销close事件
        offClose: function (element) {
            var index = element.data("auiCloseIndex");
            if (index >= 0 || index < close.length) {
                element.removeData("auiCloseIndex");
                delete close[index];
            } else {
                $.error('Index ' + index + ' is out of range.when delete callback from "$$.close".');
            }

        },
        //设置close事件的visibility属性，该属性为false时不会执行对应的回调函数
        closeVisibility: function (element, value) {
            var index = element.data("auiCloseIndex");
            if (index >= 0 || index < close.length) {
                close[index].visibility = value;
            } else {
                $.error('Index ' + index + ' is out of range.when set visibility to "$$.close".');
            }
        },
        //例外一次
        closeExcept: function (element, value) {
            var index = element.data("auiCloseIndex");
            if (index >= 0 || index < close.length) {
                close[index].except = value;
            } else {
                $.error('Index ' + index + ' is out of range.when set except to "$$.close".');
            }
        },
        //在锁定期间例外
        closeLock: function (element, value) {
            var index = element.data("auiCloseIndex");
            if (index >= 0 || index < close.length) {
                close[index].lock = value;
            } else {
                $.error('Index ' + index + ' is out of range.when set except to "$$.close".');
            }
        }
    }

    $.extend($$, method);
})(AUI, jQuery);