(function ($$, $) {
    "use strict";

    var _cycle = {
        tab: 0,
        arrow: 1,
        tabAndArrow: 2
    };

    $$.tabbable = function (type) {
        var value = null;
        type = type.toLowerCase();
        if (type == "cycle") {
            value = $.extend(true, value, _cycle);
        }
        return value;
    };

    $.widget("aui.tabbable", {
        options: {
            mode: null
        },
        _tabbableIndex: null,
        _create: function () {
            this._initMembers()
                ._initEvent();
        },
        //初始化成员
        _initMembers: function () {
            var self = this;

            if (self.options.mode == null) {
                self.options.mode = _cycle.tab;
            }

            this._tabbableIndex = -1;

            return this;
        },
        //注册事件
        _initEvent: function () {
            var self = this;

            self.element.on('keydown' + self.eventNamespace, self, self._onKeydown);

            return self;
        },
        //tab切换断言
        _tabAssert: function (key) {
            return (key == $.ui.keyCode.TAB);
        },
        //tab和箭头切换断言
        _tabAndArrowAssert: function (key) {
            return (key == $.ui.keyCode.TAB || key == $.ui.keyCode.DOWN || key == $.ui.keyCode.UP);
        },
        //箭头切换断言
        _arrowAssert: function (key) {
            return (key == $.ui.keyCode.DOWN || key == $.ui.keyCode.UP);
        },
        _getAssert: function () {
            var
                self = this,
                assert,
                type = self.options.mode;

            switch (type) {
                case _cycle.tab:
                    assert = self._tabAssert;
                    break;
                case _cycle.arrow:
                    assert = self._arrowAssert;
                    break;
                case _cycle.tabAndArrow:
                    assert = self._tabAndArrowAssert;
                    break;
                default:
                    assert = $.noop;
                    break;
            }

            return assert;
        },
        //在键盘按下时处理焦点切换逻辑
        _onKeydown: function (e) {
            var
                self = e.data,
                assert = self._getAssert(),

                tabbables = $(":tabbable", self.element),
                //
                first = tabbables.filter(":first"),
                //
                last = tabbables.filter(":last");

            if (assert(e.which)) {
                if (e.which == $.ui.keyCode.DOWN) {
                    //点击下箭头的处理逻辑。
                    self._tabbableIndex++;
                    if (self._tabbableIndex == tabbables.length) {
                        self._tabbableIndex = 0;
                    }
                    tabbables[self._tabbableIndex].focus();
                    return false;
                } else if (e.which == $.ui.keyCode.UP) {
                    //点击上箭头的处理逻辑
                    self._tabbableIndex--;
                    if (self._tabbableIndex == -1) {
                        self._tabbableIndex = tabbables.length - 1;
                    }
                    tabbables[self._tabbableIndex].focus();
                    return false;
                } else {
                    //点击Tab键的处理逻辑
                    if (!e.shiftKey) {
                        self._tabbableIndex++;
                        if (e.target === last[0]) {
                            self._tabbableIndex = 0;
                            first.focus();
                            return false;
                        }
                    } else {
                        self._tabbableIndex--;
                        if (e.target === first[0]) {
                            last.focus();
                            self._tabbableIndex = tabbables.length - 1;
                            return false;
                        }
                    }
                }
            } else if (e.which == $.ui.keyCode.TAB) {
                //arrow模式下禁用tab切换
                e.preventDefault();
            }
        },
        _destroy: function () {
            this.element.off(self.eventNamespace);
        }
    });
})(AUI, jQuery);