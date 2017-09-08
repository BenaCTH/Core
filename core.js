(function (window, $) {
    var
        //保存当前的window.AUI对应的值
        _AUI = window.AUI,
        //保存当前的window.$$对应的值
        _$$ = window.$$,
        AUI,
        objectUtil,
        logUtil,
        logIndex = 0,
        isShowLog = true,
        constant;

    AUI = {};

    //控件对应的组件在window上的命名空间
    window.R = {};

    function getPath() {
        var
            script = document.getElementsByTagName('script'),
            value = '',
            i = 0,
            target = [],
            c = script.length,
            tc = 0;

        for (; i < c; i++) {
            target = script[i].src.split('/');
            tc = target.length;
            if (target[tc - 1].indexOf("auiframework.min.js") == 0 || target[tc - 1].indexOf("aui.auiframework.js") == 0 || target[tc - 1].indexOf("core.js") == 0) {
                value = target.slice(0, tc - 2).join('/');
                break;
            }
        }

        return value;
    }

    AUI.path = getPath();

    function getScrollSize() {
        var
            result = {},
            $div = $('<div style="position:fixed;overflow:scroll;width:100px;height:100px;top:0;"></div>');

        $('body').append($div);

        result = {
            horizontal: $div[0].offsetHeight - $div[0].clientHeight,
            vertical: $div[0].offsetWidth - $div[0].clientWidth
        };
        $div.remove();

        return result;

    }

    AUI.scrollSize = getScrollSize();

    //浏览器版本
    AUI.browser = function (ua) {
        ua = ua.toLowerCase();

        var match = /(edge)[ \/]([\w.]+)/.exec(ua) || /(chrome)[ \/]([\w.]+)/.exec(ua) || /(safari)[ \/]([\w.]+)/.exec(ua) || /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) || /(msie) ([\w.]+)/.exec(ua) || ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) || [];
        if (!!window.ActiveXObject || "ActiveXObject" in window) {
            match[1] = 'msie';
        }
        return {
            browser: match[1] || "",
            version: match[2] || "0"
        };
    }((navigator.userAgent));

    objectUtil = {
        stringFormat: function () {
            var args = arguments;
            if (!args[0]) {
                $$.log("Please enter i18n parameters.");
                return "";
            }
            var bool = $.isArray(args[1]);
            return args[0].replace(/\{(\d+)\}/g, function (m, n) { 
                return bool ? args[1][n] : args[parseInt(n) + 1];
            });
        },
        getClass: function (object) {
            return Object.prototype.toString.call(object).match(/^\[object\s(.*)\]$/)[1];
        },
        isDate: function (date) {
            return $$.getClass(date) == "Date";
        },
        //是否为空
        isEmpty: function (value) {
            var result = false;
            if (value != null) {
                result = true;
                if (typeof value == "string" && this.isEmptyString(value)) {
                    result = false;
                } else if ($.isEmptyObject(value)) {
                    if (!this.isDate(value)) {
                        result = false;
                    }
                } else if ($.isArray(value) && value.length == 0) {
                    result = false;
                }
            }

            return result;
        },
        //是否选中
        isChecked: function (result) {
            return result
        },
        //是否是空字符串
        isEmptyString: function (str) {
            var result = false;

            if (str == "") {
                result = true;
            } else {
                result = /^[ ]+$/.test(str);
            }

            return result;
        },
        //是否是整数
        isInteger: function (value) {
            //Number.isInteger
            return Math.floor(value) === (value - 0);
        },
        isJQueryObject: function (obj) {
            return this.isObject(obj) && obj.constructor === jQuery;
        },
        //是否是负整数
        isNegativeInteger: function (value) {
            return /-[1-9]\d*$/.test(value)
        },
        isObject: function (obj) {
            return $$.getClass(obj) == "Object";
        },
        //是否是正整数
        isPositiveInteger: function (value) {
            return /^[1-9]\d*$/.test(value);
        },
        //是否是非负整数
        isNonnegativeInteger: function (value) {
            value = value - 0;
            return this.isInteger(value) && value >= 0;
        },
        //是否是非正整数
        isNonpositiveInteger: function (value) {
            value = value - 0;
            return this.isInteger(value) && value <= 0;
        },
        //是否是url
        isUrl: function (value) {
            return new RegExp("[a-zA-z]+://[^\s]*").test(value);
        },
        isEmail: function (value) {
            return /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(value);
        },
        isLetters: function (value) {
            return /^[A-Za-z]+$/.test(value);
        },
        isSpecialCharacters: function (value) {
            return /^[~！@#￥%……&*（）——【】；‘’，。、“”!@#\$%\^\&\*\(\)\-_\+=\[\]\{\}\|\\:;""'<,>\.\?/\s]{1,}$/.test(value);
        },
        isTooShort: function (value) {
            return value.length > 5 || value.length == 0;
        },
        hasDigit: function (value) {
            return /[0-9]+/.test(value);
        },
        hasLetters: function (value) {
            return /[A-Za-z]+/.test(value);
        },
        hasSpecialCharacters: function (value) {
            return /[~！@#￥%……&*（）——【】；‘’，。、“”!@#\$%\^\&\*\(\)\-_\+=\[\]\{\}\|\\:;""'<,>\.\?/\s]+/.test(value);
        },
        isUNCPath: function (value) {
            return /\\\\[\w.-]+\\[^\\?<>*:|/]+/.test(value);
        },
        isUserName: function (value) {
            function removeEmptyEntities(value) {
                for (var i = 0; i < value.length; i++) {
                    if (value[i] == '' || value[i] == null || typeof (value[i]) == undefined) {
                        value.splice(i, 1);
                        i = i - 1;
                    }
                }
                return value;
            }
            return $$.isEmail(value) || (value.includes('\\') && removeEmptyEntities(value.split('\\')).length == 2);
        }
    };
    $.extend(AUI, objectUtil);

    logUtil = {
        isShowLog: function (value) {
            isShowLog = value;
        },
        logIndex: 0,
        //输出log信息
        log: function () {
            try {
                if (isShowLog === true) {
                    if (typeof console != "undefined" && typeof console.log != "undefined") {
                        console.log.apply(console, ["[" + logIndex + "] "].concat(Array.prototype.slice.call(arguments)));
                        logIndex++;
                    }
                }
            } catch (e) {
                // Ignore;
            }
        },
        //输出debug log信息
        debug: function () {
            try {
                if (isShowLog === true) {
                    if (typeof console != "undefined" && typeof console.debug != "undefined") {
                        console.debug.apply(console, ["[" + logIndex + "] "].concat(Array.prototype.slice.call(arguments)));
                        logIndex++;
                    }
                }
            } catch (e) {
                // Ignore;
            }
        },
        //输出info log信息
        info: function () {
            try {
                if (isShowLog === true) {
                    if (typeof console != "undefined" && typeof console.info != "undefined") {
                        console.info.apply(console, ["[" + logIndex + "] "].concat(Array.prototype.slice.call(arguments)));
                        logIndex++;
                    }
                }
            } catch (e) {
                // Ignore;
            }
        },
        //输出warning log信息
        warn: function () {
            try {
                if (isShowLog === true) {
                    if (typeof console != "undefined" && typeof console.warn != "undefined") {
                        console.warn.apply(console, ["[" + logIndex + "] "].concat(Array.prototype.slice.call(arguments)));
                        logIndex++;
                    }
                }
            } catch (e) {
                // Ignore;
            }
        },

        /**
         * 输出error log信息
         * @method error
         */
        error: function () {
            try {
                if (isShowLog === true) {
                    if (typeof console != "undefined" && typeof console.error != "undefined") {
                        console.error.apply(console, ["[" + logIndex + "] "].concat(Array.prototype.slice.call(arguments)));
                        logIndex++;
                    }
                }
            } catch (e) {
                // Ignore;
            }
        },
    };
    $.extend(AUI, logUtil);

    constant = {
        //创建事件回调的参数对象
        Event: function (props) {
            if (!(this instanceof $$.Event)) {
                return new $$.Event(props);
            }

            //触发事件属性的原值
            this.oldValue = null,
                //触发事件属性的新值
                this.newValue = null,
                //控件的寄宿jQuery对象
                this.element = null,
                //开发自定义参数
                this.parameters = {};
            $.extend(this, props);
        }

    };
    $.extend(AUI, constant);

    //控件使用的词条
    AUI.I18N = {
        calendar: {
            //选中的时间小于当前时间
            earlierTime: "Invalid time,The selected time cannot be earlier than current time.",
            today: "Today",
        },
        captcha: {
            emptyMessage: '!Please enter verification code',
            errorMessage: '!Verification code error'
        },
        combobox: {
            //水印对应的词条
            waterMark: "Select one",
            //过滤结果为空时的词条
            noMatches: "No matches found."
        },
        datagrid: {
            //过滤功能，清楚过滤对应的词条
            clearFiltersFrom: "Clear Filters from ",
            //过滤功能，Cancel按钮对应的词条
            filterCancel: "Cancel",
            //过滤功能，OK按钮对应的词条
            filterOK: "OK",
            //隐藏列对应的词条
            hideColumn: "Hide This Column",
            //过滤功能Select All复选框对应的词条
            selectAllforFilter: "Select All",
            //没有数据时的提示语
            noneMessage: "There are no items to show in this view.",
            //字符类型的数据排序时，使用的提示语（升序）
            sortAToZ: "Sort A to Z",
            //字符类型的数据排序时，使用的提示语（降序）
            sortZToA: "Sort Z to A",
            //Date类型的数据排序时，使用的提示语（升序）
            oldToNew: "Sort Oldest to Newest",
            //Date类型的数据排序时，使用的提示语（降序）
            newToOld: "Sort Newest to Ordest",
            //数字类型的数据排序时，使用的提示语（升序）
            ascending: "Ascending",
            //数字类型的数据排序时，使用的提示语（降序）
            descending: "Descending"
        },
        datepicker: {
            //选中的时间小于当前时间
            earlierTime: "Invalid time,The selected time cannot be earlier than current time.",
            today: "Today",
            timeZone: "Time Zone:",
            savingTime: "Automatically adjust clock for daylight saving time",
            ok: "OK",
            cancel: "Cancel"
        },
        eventcalendar: {
            //没有被展开的记录,使用的提示语
            xMore: "{0} more",
            showless: 'Show less'
        },
        globalcalendar: {
            toPreviousMonth: "Go to previous month",
            toNextMonth: "Go to next month"
        },
        gcalendar: {
            //采用12小时制时，上午的缩写
            am: "AM",
            //采用12小时制时，下午的缩写
            pm: "PM",
            //月份全称
            months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            //
            previous: "Prev",
            //
            next: "Next",
            //月份简写（大写） 
            shortCapitalMonths: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
            //月份简写
            shortMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            //星期全称
            weeks: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            middleweeks: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            //星期简写
            shortweeks: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
            //标题格式
            titleFormat: "m/, /yyyy",
            today: "Today"
        },
        loading: {
            loading: "Loading..."
        },
        multicombobox: {
            //全选时显示的词条
            allText: "Select All",
            //
            none: "None",
            selectedXItems: "Select {0} items",
            selectedXItem: "Select {0} item",

            //全选checkbox对应的词条
            selectAllCheckbox: "Select All",
        },
        pager: {
            page: "Page",
            of: " of ",
            showRows: 'Show rows',
            goTo: 'Go to',
        },
        peoplepicker: {
            addBtnText: 'Add',
            cancelBtnText: 'Cancel',
            findText: 'Find',
            nonSelected: 'You must specify a value for this required field.',
            // noExact:'No exact match was found.Click the item(s) that did not resolve for more options.',
            okBtnText: 'OK',
            //noMatchedItem: 'No results were found to match your search item.Please enter a new term or less specific term.',
            noSearchItems: 'Please enter a search term(s).'
        },
        rangepicker: {
            earlierStart: "Invalid time range,The finish time cannot be earlier than start time."
        },
        reservation: {
            shortweeks: ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'],
            //没有被展开的记录,使用的提示语
            xMore: "{0} more",
            //关闭多余记录，使用的提示语
            showless: "show less",
            //add按钮使用的提示语
            add: "Add"
        },
        richcombobox: {
            //过滤结果为空时的词条
            noMatches: "No matches found."
        },
        timezones: [{
            id: "Asia/Hong_Kong",
            displayName: "(UTC+08:00)Beijing,Chongqing,Hong Kong",
            zone: "(UTC+08:00)",
            supportsDaylightSavingTime: false,
            autoAdjustClock: false
        }, {
            id: "Asia/Tokyo",
            displayName: "(UTC+09:00)Japan",
            zone: "(UTC+09:00)",
            supportsDaylightSavingTime: true,
            autoAdjustClock: true
        }, {
            id: "Asia/Samon",
            displayName: "(UTC+11:00)Samon",
            zone: "(UTC+11:00)",
            supportsDaylightSavingTime: true,
            autoAdjustClock: false
        }]
    };

    /**
     * 强制刷新控件对应的组件
     * @param {object} instance 组件实例
     * @param {string} ref 组件实例再refs中的名称
     * @param {object} state 需要设置的状态 
     * @param {function} callback 回调
     */
    AUI.setState = function (instance, id, state, callback) {
        var uiElement = $('[id="' + id + '"]');

        if (uiElement.length == 1) {
            uiElement[0].setShouldUpdate(true);
            if ($.isFunction(callback)) {
                instance.setState(state, callback);
            } else {
                instance.setState(state);
            }
            var timer = setInterval(function () {
                clearInterval(timer);
                if ($.isFunction(uiElement[0].setShouldUpdate)) {
                    uiElement[0].setShouldUpdate(false);
                }
            });
        } else if (uiElement.length > 1) {
            $.error('The id "' + id + '" is not unique in the whole document.Please check your code.')
        }

    }

    /**
     * 触发验证逻辑
     * @param {element} 触发验证的DOM元素
     */
    AUI.verify = function (target) {
        var
            //前台验证结果
            result = false,
            vtGroup = $(target).closest('[data-part=vtgroup]');

        if (vtGroup.length > 0) {
            result = vtGroup.validationgroup('verify');
        }

        return {
            result: result,
            vtGroup: function () {
                if (arguments[0] == "option") {
                    $.error('call method "option" is not allowed.')
                }
                return vtGroup.validationgroup.apply(vtGroup, arguments);
            }
        };
    }


    window.$$ = window.AUI = AUI;
})(window, $);