//@author fqwu
(function ($$, $) {
    "use strict";

    var
        uuid = -1,
        //日历模式
        _view = {
            month: 0,
            year: 1,
            decade: 2
        },
        //星期对应的常量
        _dayOfWeek = {
            Sunday: 0,
            Monday: 1,
            Tuesday: 2,
            Wednesday: 3,
            Thursday: 4,
            Friday: 5,
            Saturday: 6
        },
        //常量
        _constant = {
            CALENDAR_CLASS: "aui-calendar",
            AUI_WIDGET: 'aui-widget',
            CONTAINER_CLASS: "aui-calendar-container",
            HEADER_CLASS: "aui-calendar-header",
            TITLE_CLASS: "aui-calendar-title",
            LEFT_ARROW_CLASS: "aui-calendar-left",
            LEFT_ARROW_ICON_CLASS: "faui-angle-left-s",
            RIGHT_ARROW_CLASS: "aui-calendar-right",
            RIGHT_ARROW_ICON_CLASS: "faui-angle-right-s",
            YEAR_VIEW_CLASS: "aui-calendar-year-view",
            YEAR_VIEW_CONTENT_CLASS: "aui-calendar-year-view-content",
            YEAR_ITEM_CLASS: "aui-calendar-year-item",
            YEAR_SELECTED_CLASS: "aui-calendar-year-selected",
            DECADE_VIEW_CLASS: "aui-calendar-decade-view",
            DECADE_VIEW_CONTENT_CLASS: "aui-calendar-decade-view-content",
            DECADE_ITEM_CLASS: "aui-calendar-decade-item",
            MONTH_VIEW_CONTAINER: "aui-calendar-month-view",
            MONTH_VIEW_TABLE_CLASS: "aui-calendar-month-table",
            MONTH_VIEW_HEADER_CLASS: "aui-calendar-month-header",
            MONTH_HEADER_ITEM_CLASS: "aui-calendar-month-header-item",
            MONTH_VIEW_CONTENT_CLASS: "aui-calendar-month-content",
            MONTH_ITEM_CLASS: "aui-calendar-month-item",
            MONTH_ITEM_TEXT_CLASS: "aui-calendar-month-item-text",
            MONTH_ITEM_CIRCLE_CLASS: "aui-calendar-month-item-circle",
            MONTH_ITEM_PAST_CLASS: "aui-calendar-past-item",
            MONTH_ITEM_FEATURE_CLASS: "aui-calendar-month-feature-item",
            MONTH_ITEM_CURRENT_CLASS: "aui-calendar-month-current-item",
            MONTH_ITEM_TODAY_CLASS: "aui-calendar-month-today-item",
            MONTH_ITEM_SELECTED_CLASS: "aui-calendar-month-selected-item",
            TODAY_CLASS: "aui-calendar-today",
            ITEM_DISABLED_CLASS: "aui-calendar-item-disabled",
            MONTH_ITEM_SELECTED_START_CLASS: "aui-calendar-selected-start-item",
            MONTH_ITEM_SELECTED_END_CLASS: "aui-calendar-selected-end-item",
            MONTH_ITEM_SELECTED_RANGE_CLASS: "aui-calendar-selected-range-item",
            MONTH_ITEM_SHADOW: "aui-calendar-shadow"
        };

    /**
     * 获取calendar控件的常量。
     * @method $$.datagrid
     * @param {String} type 常量名称。
     */
    $$.calendar = function (type, param) {
        var value = null;
        type = type.toLowerCase();
        switch (type) {
            case "dayofweek":
                value = $.extend(value, _dayOfWeek);
                break;
            case "view":
                value = $.extend(value, _view);
                break;
            case "constant":
                value = $.extend(value, _constant);
                break;
            default:
                value = {};
                break;
        }

        return value;
    };



    $.widget("aui.calendar", {
        titleId: 'aui-calendar-title-',
        lefId: 'aui-calendar-left-',
        rightId: 'aui-calendar-right-',
        selectedDayId: "aui-calendar-selected-day-",
        monthViewId: 'aui-calendar-month-view-',
        monthViewContentId: 'aui-calendar-month-view-content-',
        yearViewId: 'aui-calendar-year-view-',
        decadeViewId: 'aui-calendar-decade-view-',
        todayId: 'aui-calendar-today-',
        $title: null,
        $left: null,
        $right: null,
        $monthView: null,
        $monthViewContent: null,
        $monthItem: null,
        //Month Items jQuery Array
        $monthItems: null,
        $yearView: null,
        $yearItem: null,
        //Year Items jQuery Array
        $yearItems: null,
        $decadeView: null,
        $decadeItem: null,
        //Decade Items jQuery Array
        $decadeItems: null,
        $today: null,
        //Month/Year/Decade
        view: _view.month,
        //获取或设置一个值，该值表示日历中上个月天数
        past: 0,
        //获取或设置一个值，该值表示日历中下个月第一天的序号
        future: 0,
        //current page:year,month,day
        year: 0,
        month: 0,
        day: 0,
        //十年视图的起始结束年份
        _decadeStart: 0,
        _decadeEnd: 9,
        //该集合表示需要生成的天的数目
        calendarDayCount: 42,
        titleFormat: null,
        //the index of selectedDate
        selectedIndex: -1,
        options: {
            //获取或设置一个值，该值表示日历的视图模式。默认值$$.calendar("view").month，表示月视图
            displayMode: _view.month,
            //获取或设置一个值，指示在调用与日期相关的函数时使用的每周的第一天。只在控件初始化时有效
            firstDayOfWeek: _dayOfWeek.Sunday,
            height: '362',
            //获取或设置一个值，该值与数据源的一个属性进行绑定，表示是否设置了任务。
            hasTaskBind: null,
            //single: Date | multiple : Date Array | range : Object
            selectedDate: null,
            //获取或设置一个值，该值表示标题的格式。默认值为null,表示使用$$.I18N.calendar.titleFormat定义的全局格式
            titleFormat: null,
            width: '258',
            hasToday: true,
            //'single'/'multiple'/'range'
            mode: 'single',
            enableDates: null,
            onMonthChange: $.noop,
            dayClick: $.noop,
            onChange: $.noop,
            todayClick: $.noop
        },
        _create: function () {
            var self = this;

            self._initMembers()
                ._calculateCalendarDay(this._selectedDate)
                ._createCalendar()
                ._loaded()
                ._updateMonthItem()
                ._updateTitle()
                ._setSelectedDates()
                ._setToday()
                ._setTabIndex()
                ._updateDisplayMode(self.options.displayMode)
                ._initEvent()
                ._onMonthChange();
        },
        _setOption: function (key, value) {
            var self = this,
                oldValue = self.options[key];
            if (value === oldValue) return false;
            this.options[key] = value;
            switch (key) {
                case "selectedDate":
                    self._getCalcDate(value)
                        ._initEmptyDateByMode()
                        ._generateView(this._selectedDate)
                        ._onChange();
                    break;
                case "displayMode":
                    self._updateDisplayMode(value);
                    break;
                case "itemsSource":
                    self.itemsSource(value);
                    break;
                case "enableDates":
                    self._generateView();
                    break;
            }
        },
        _createCalendar: function () {
            var
                self = this,
                h = -1,
                html = [];

            html[++h] = self._createTitle();
            html[++h] = self._createMonthView();
            html[++h] = self._createYearView();
            html[++h] = self._createDecadeView();
            self.container = $('<div class="' + _constant.CONTAINER_CLASS + '"></div>');
            self.container.html(html.join(''));
            self.element.html(self.container);

            return self;
        },
        _createToday: function () {
            var
                self = this,
                h = -1,
                html = [];

            html[++h] = '<div style="text-align:right;margin-top: 10px;"><input id="' + self.todayId + '" class="' + _constant.TODAY_CLASS + '" type="button" value="' + $$.I18N.calendar.today + '" /></div>';
            return html.join('');
        },
        _initId: function () {
            var self = this;

            self.titleId += uuid;
            self.lefId += uuid;
            self.rightId += uuid;
            self.selectedDayId += uuid;
            self.monthViewId += uuid;
            self.monthViewContentId += uuid;
            self.yearViewId += uuid;
            self.decadeViewId += uuid;
            self.todayId += uuid;
            return self;
        },
        _initMembers: function () {
            var self = this;
            ++uuid;
            self._initEmptyDateByMode()
                ._getCalcDate(this.options.selectedDate)
                ._initId();
            self.calendarDays = [];
            self.$monthItems = [];
            self.$monthItemText = [];
            self.$monthItemTexts = [];
            self.$monthItemCircle = [];
            self.$monthItemCircles = [];
            self.$yearItems = [];
            self.$decadeItems = [];
            self.currentDate = new Date();
            self.titleFormat = (self.options.titleFormat || $$.I18N.calendar.titleFormat);
            if (self.titleFormat != null) {
                self.titleFormat = self.titleFormat.split("/");
            } else {
                $.error("Title format is null please check your settings.");
            }

            self.element
                .addClass(_constant.CALENDAR_CLASS + ' ' + _constant.AUI_WIDGET)
                .attr("unselectable", "on")
                .height(self.options.height)
                .width(self.options.width);

            return self;
        },
        _initEmptyDateByMode: function () {
            if (!this.options.selectedDate) {
                switch (this.options.mode) {
                    case 'single':
                        this.options.selectedDate = null;
                        break;
                    case 'multiple':
                        this.options.selectedDate = [];
                        break;
                    case 'range':
                        this.options.selectedDate = {};
                        break;
                }
            }
            return this;
        },
        _getCalcDate: function (value) {
            this._selectedDate = value;
            switch (this.options.mode) {
                case 'multiple':
                    this._selectedDate = value && value[0] || null;
                    break;
                case 'range':
                    this._selectedDate = value && value.start || null;
                    break;
            }
            return this;
        },
        _generateView: function (day, tag) {
            this
                ._calculateCalendarDay(day)
                ._updateMonthItem()
                ._updateTitle()
                ._setSelectedDates()
                ._setToday(tag)
                ._setTabIndex();
            return this;
        },
        _loaded: function () {
            var
                self = this;

            self.$title = self.element.find("#" + self.titleId);
            self.$left = self.element.find("#" + self.lefId);
            self.$right = self.element.find("#" + self.rightId);
            self.$today = self.element.find("#" + self.todayId);
            self.$monthView = self.element.find("#" + self.monthViewId);
            self.$monthViewContent = self.$monthView.find("#" + self.monthViewContentId);
            self.$monthItem = self.$monthView.find('tbody').find('td[class="' + _constant.MONTH_ITEM_CLASS + '"]');
            self.$monthItemText = self.$monthItem.children('[class~="' + _constant.MONTH_ITEM_TEXT_CLASS + '"]');
            self.$monthItemCircle = self.$monthItem.children('[class~="' + _constant.MONTH_ITEM_CIRCLE_CLASS + '"]');
            self._getViewItem(self.$monthItem, self.$monthItems);
            self._getViewItem(self.$monthItemText, self.$monthItemTexts);
            self._getViewItem(self.$monthItemCircle, self.$monthItemCircles);

            self.$yearView = self.element.find("#" + self.yearViewId);

            self.$yearItem = self.$yearView.find('td[class="' + _constant.YEAR_ITEM_CLASS + '"]');
            self._getViewItem(self.$yearItem, self.$yearItems);

            self.$decadeView = self.element.find("#" + self.decadeViewId);

            self.$decadeItem = self.$decadeView.find('td[class="' + _constant.DECADE_ITEM_CLASS + '"]');
            self._getViewItem(self.$decadeItem, self.$decadeItems);
            self.$decadeItems[0].addClass(_constant.MONTH_ITEM_PAST_CLASS);
            self.$decadeItems[11].addClass(_constant.MONTH_ITEM_PAST_CLASS);

            return self;
        },
        _initEvent: function () {
            var self = this;

            //title 
            self.$title.on("click", self, self._onTitleClick);
            self.$left.on("click", self, self._onLeftClick);
            self.$right.on("click", self, self._onRightClick);

            self.$today.on("click", self, self._onTodayClick);

            //month
            self.$monthViewContent
                .on("click", 'td', self, self._onMonthItemClick)
                .on('keydown', 'td', self, self._onMonthItemKeydown)
                .on('keydown', self, self._onMonthViewKeydown);

            //year
            self.$yearItem.on("keydown", self, self._onYearItemKeydown)
                .on("click", self, self._onYearItemClick);

            //decade
            self.$decadeItem.on("keydown", self, self._onDecadeKeydown)
                .on("click", self, self._onDecadeClick);

            return self;
        },
        _getViewItem: function (item, items) {
            var
                i = 0,
                c = item.length;

            for (; i < c; i++) {
                items[i] = $(item[i]);
            }
        },
        _updateDisplayMode: function (view) {
            var self = this
            self.view = view;
            switch (self.view) {
                case _view.month:
                    self._goToMonthView();
                    break;
                case _view.year:
                    self._goToYearView();
                    break;
                default:
                    break;
            }

            return self;
        },
        _goToMonthView: function () {
            var self = this;
            self.options.displayMode = self.view = _view.month;
            self.$decadeView.hide();
            self.$yearView.hide();
            self.$monthView.show();
            self._updateTitle();
            this.element.triggerHandler("ViewChange", _view.month);
            return self;
        },
        _goToYearView: function () {
            var self = this;
            self.options.displayMode = self.view = _view.year;
            self.$decadeView.hide();
            self.$monthView.hide();
            self.$yearView.show();
            self._updateTitle()
                ._setSelectedMonth(self.month);
            this.element.triggerHandler("ViewChange", _view.year);
            return self;
        },
        _goToDecade: function (year) {
            var self = this;

            self._updateDecadeItem(year)
                ._updateTitle()
                ._setSelectedYear(year);
            this.element.triggerHandler("ViewChange", _view.decade);
        },
        _makeDate: function (y, m, d) {
            var date = new Date(1970, 0, 1, 0);

            date.setFullYear(y);
            date.setMonth(m);
            date.setDate(d);

            return date;
        },
        itemsSource: function (source) {
            var
                i = 0, c = source.length,
                name = this.options.hasTaskBind;
            this.$monthItemCircle.hide();
            if (name != null) {
                for (; i < c; i++) {
                    if (source[i][name] == true) {
                        this.$monthItemCircles[i].show();
                    }
                }
            }

        },
        goToMonthView: function () {
            this._goToMonthView();
        },
        setFocus: function () {
            this.element.find('.' + _constant.MONTH_ITEM_SELECTED_CLASS).first().focus();
        }
    });

    //title区域相关逻辑
    $.extend($.aui.calendar.prototype, {
        _createTitle: function () {
            var
                self = this,
                h = -1,
                html = [];

            html[++h] = '<div class="' + _constant.HEADER_CLASS + '">';
            html[++h] = '<div id="' + self.lefId + '" class="' + _constant.LEFT_ARROW_CLASS + ' ' + _constant.LEFT_ARROW_ICON_CLASS + '" aria-describedby="' + self.lefId + '-span"></div>';
            html[++h] = '<div id="' + self.titleId + '" class="' + _constant.TITLE_CLASS + '" aria-live="assertive" aria-atomic="true"></div>';
            html[++h] = '<div id="' + self.rightId + '" class="' + _constant.RIGHT_ARROW_CLASS + ' ' + _constant.RIGHT_ARROW_ICON_CLASS + '" aria-describedby="' + self.rightId + '-span"></div>';
            html[++h] = '</div>';

            return html.join('');
        },
        _updateTitle: function () {
            var self = this;
            switch (self.view) {
                case _view.month:
                    self.$title.text(self._converterTitle());
                    break;
                case _view.year:
                    self.$title.text(self.year);
                    break;
                case _view.decade:
                    self.$title.text((self._decadeStart + 1) + "-" + (self._decadeEnd - 1));
                    break;
            }

            return self;
        },
        _converterTitle: function () {
            var
                self = this,
                value = '',
                month = self.month,
                format = self.titleFormat,
                i = 0,
                c = format.length;

            for (; i < c; i++) {
                switch (format[i]) {
                    case "m":
                        value += $$.I18N.calendar.months[month];
                        break;
                    case "M":
                        value += $$.I18N.calendar.shortCapitalMonths[month];
                        break;
                    case "yyyy":
                        value += self.year;
                        break;
                    default:
                        value += format[i];
                        break;
                }
            }
            return value;

        },
        _onTitleClick: function (e) {
            var self = e.data;
            //月视图 to 年视图 to 实际视图
            switch (self.view) {
                case _view.month:
                    self._goToYearView();
                    break;
                case _view.year:
                    self._goToDecadeView();
                    break;
                default:
                    break;
            }
        },
        _onLeftClick: function (e) {
            var
                self = e.data;

            if (self.view == _view.month) {
                self._toPrevMonth(e);
            } else if (self.view == _view.year) {
                --self.year;
                self._updateTitle();
            } else if (self.view == _view.decade) {
                self._toPrevDecade();
            }
        },
        _onMonthItemClick: function (e) {
            var
                self = e.data,
                index = e.currentTarget.getAttribute("data-index") - 0,
                day;
            if (self.calendarDays[index].disabled) {
                return false;
            }
            day = self.$monthItemTexts[index].text() - 0;

            self._clickSetSelectedDay($(this), e);
        },
        _onRightClick: function (e) {
            var
                self = e.data;

            if (self.view == _view.month) {
                self._toNextMonth(e);
            } else if (self.view == _view.year) {
                ++self.year;
                self._updateTitle();
            } else if (self.view == _view.decade) {
                self._toNextDecade();
            }
        },
        _onTodayClick: function (e) {
            var self = e.data;
            if (self.view != _view.month) {
                self._goToMonthView();
            }
            self.displayDate = new Date();
            self._generateView(self.displayDate, 'todayClick');

            self.Handler("todayClick", e, {
                element: self.element,
                newValue: new Date()
            });
        },
        _onMonthViewKeydown: function (e) {
            var self = e.data;
            e.stopPropagation();

            switch (e.which) {
                case $.ui.keyCode.PAGE_UP:
                    e.preventDefault();
                    self._toPrevMonth(e);
                    break;
                case $.ui.keyCode.PAGE_DOWN:
                    e.preventDefault();
                    self._toNextMonth(e);
                    break;
                default:
                    break;
            }
        },
        _onMonthItemKeydown: function (e) {
            var
                self = e.data,
                index = e.currentTarget.getAttribute("data-index") - 0,
                canChange = true;

            //if ($(e.currentTarget).hasClass(_constant.ITEM_DISABLED_CLASS)) {
            //    return false;
            //}

            switch (e.which) {
                case $.ui.keyCode.LEFT:
                    index--;
                    break;
                case $.ui.keyCode.UP:
                    index -= 7;
                    break;
                case $.ui.keyCode.RIGHT:
                    index++;
                    break;
                case $.ui.keyCode.DOWN:
                    index += 7;
                    break;
                case $.ui.keyCode.TAB:
                    canChange = false;
                    break;
                case $.ui.keyCode.SPACE:
                    e.preventDefault();
                    self._clickSetSelectedDay($(self.$monthItem[index]), e);

                    canChange = false;
                    break;
                default:
                    canChange = false;
                    break;
            }
            if (canChange) {
                e.preventDefault();
                //index = findItem(index, e.which);
                if (index == -1) {
                    return;
                }
                self.$monthItem.attr('tabindex', -1);
                $$.log('key down index', index);
                $(self.$monthItem[index]).attr("tabindex", 0).focus();
            }


            function findItem(index, operation) {
                if (index < 0 || index >= 42) {
                    return -1;
                }
                var monthItem = self.$monthItems[index];
                if (monthItem.hasClass(_constant.ITEM_DISABLED_CLASS)) {
                    switch (operation) {
                        case $.ui.keyCode.LEFT:
                            index--;
                            break;
                        case $.ui.keyCode.UP:
                            index -= 7;
                            break;
                        case $.ui.keyCode.RIGHT:
                            index++;
                            break;
                        case $.ui.keyCode.DOWN:
                            index += 7;
                            break;
                    }
                    return findItem(index, operation);
                }
                else {
                    return index;
                }
            }
        },
        _toPrevMonth: function (e) {
            this._goToMonth(this.month - 1, e);
            return this;
        },
        _toNextMonth: function (e) {
            this._goToMonth(this.month + 1, e);
            return this;
        },
        _toPrevDecade: function () {
            var self = this;
            self.year = self._decadeStart - 9;
            self._goToDecade(self.year);
            return self;
        },
        _toNextDecade: function () {
            var self = this;
            self.year = self._decadeEnd;
            self._goToDecade(self.year);
            return self;
        }
    });
    //Month View Function
    $.extend($.aui.calendar.prototype, {
        _calculateCalendarDay: function (today) {
            var enableDates = this.options.enableDates,
                enableStart = null;

            if (Array.isArray(enableDates)) {
                enableStart = null;
            } else if (enableDates) {
                var start = enableDates.start || 1,
                    end = enableDates.end || Number.MAX_VALUE;
                if (start > new Date() || end < new Date()) {
                    enableStart = enableDates.start || enableDates.end;
                }
            }
            var self = this,
                current,
                firstDayOfWeek = self.options.firstDayOfWeek,
                today = today || this.displayDate || enableStart || new Date(),
                year = today.getFullYear(),
                day = today.getDay(),
                date = today.getDate(),
                month = today.getMonth(),
                offset = date % 7,
                //1号星期几,0表示周日
                firstDay = day - offset + 1 - firstDayOfWeek,
                //上一月的最大天数
                prevMax = 0,
                //本月的最大天数
                max = 0,
                //日历中"下个月的部分"的最大序号
                nextMax = 0,
                i = 0;

            current = this._makeDate(year, month, date);
            self.year = year;
            self.month = month;

            if (firstDay <= 0) {
                firstDay += 7;
            }
            self.past = firstDay;
            //1号的前一天，就是上个月的最后一天，就是上月的最大天数
            current.setDate(0);
            //重置year，防止前一天跨年的影响
            // current.setYear(year);
            prevMax = current.getDate();
            //将时间还原会本月
            current.setDate(1);

            current.setMonth(month + 1);
            current.setDate(0);
            max = current.getDate();
            self.future = firstDay + max - 1;

            //生成上一个月的天
            for (i = firstDay - 1; i >= 0; i--) {
                var tempDate = Date.parse(new Date(self.year, self.month - 1, prevMax));
                self.calendarDays[i] = {
                    day: prevMax,
                    date: tempDate,
                    state: _constant.MONTH_ITEM_PAST_CLASS
                };
                self.calendarDays[i].disabled = self._checkDateDisabled(tempDate);
                prevMax--;
            }
            //生成本月的天
            for (i = 0; i < max; i++) {
                var tempDate = Date.parse(new Date(self.year, self.month, i + 1));
                self.calendarDays[i + firstDay] = {
                    day: i + 1,
                    date: tempDate,
                    state: _constant.MONTH_ITEM_CURRENT_CLASS
                };
                self.calendarDays[i + firstDay].disabled = self._checkDateDisabled(tempDate);
            }
            nextMax = self.calendarDayCount - max - firstDay;
            //生成下月的天
            for (i = 0; i < nextMax; i++) {
                var tempDate = Date.parse(new Date(self.year, self.month + 1, i + 1));
                self.calendarDays[i + firstDay + max] = {
                    day: i + 1,
                    date: tempDate,
                    state: _constant.MONTH_ITEM_FEATURE_CLASS
                };
                self.calendarDays[i + firstDay + max].disabled = self._checkDateDisabled(tempDate);
            }

            return self;
        },
        _checkDateDisabled: function (date) {
            var minDate = null, maxDate = null, disabled = '';

            if (this.options.enableDates && !Array.isArray(this.options.enableDates)) {
                var start = this.options.enableDates.start,
                    end = this.options.enableDates.end;
                minDate = $$.isDate(start) ? Date.parse(new Date(start).toDateString()) : 1;
                maxDate = $$.isDate(end) ? Date.parse(new Date(end).toDateString()) : Number.MAX_VALUE;
                if (minDate && maxDate && !isNaN(minDate) && !isNaN(maxDate) && (minDate > date || date > maxDate)) {
                    disabled = _constant.ITEM_DISABLED_CLASS;
                } else {
                    disabled = '';
                }
            }
            if (this.options.enableDates && Array.isArray(this.options.enableDates)) {
                this.enableDatesForTime = this.options.enableDates.map(function (d) {
                    return new Date(d.toDateString()).getTime();
                });
                if (this.enableDatesForTime.indexOf(date) != -1) {
                    disabled = _constant.ITEM_DISABLED_CLASS;
                } else {
                    disabled = "";
                }
            }
            return disabled;
        },
        _updateMonthItem: function () {
            var
                self = this,
                i = 0,
                items = self.$monthItems,
                days = self.calendarDays,
                c = items.length;

            this.hasSelectedDay = false;
            this.hasToday = false;
            this.hasEnableDay = false;
            this.$monthViewContent.attr("tabindex", "-1");

            for (; i < c; i++) {
                items[i]
                    .removeAttr('id')
                    .attr('tabindex', '-1')
                    .removeClass(_constant.MONTH_ITEM_TODAY_CLASS)
                    .removeClass(_constant.MONTH_ITEM_FEATURE_CLASS)
                    .removeClass(_constant.MONTH_ITEM_CURRENT_CLASS)
                    .removeClass(_constant.MONTH_ITEM_PAST_CLASS)
                    .removeClass(_constant.MONTH_ITEM_SELECTED_CLASS)
                    .removeClass(_constant.ITEM_DISABLED_CLASS);
                self.$monthItemTexts[i].text(days[i].day);

                items[i].addClass(days[i].state)
                    .addClass(days[i].disabled)
                    .attr({
                        "data-start": days[i].date,
                        "aria-label": new Date(days[i].date).toDateString(),
                        "aria-disabled": days[i].disabled === "" ? false : true
                    });

                days[i].disabled === "" ? items[i].attr("tabindex", '-1') : items[i].removeAttr("tabindex");
            }

            return self;
        },
        _setSelectedDates: function () {
            var self = this;

            if (this.options.mode === "range") {
                self._setRangeModeSelectedDate();
            } else {
                //set selectedDates 
                self.$monthItems.forEach(function (item) {
                    var $item = $(item),
                        date = $item.attr("data-start") - 0;
                    if (self._getIndexOfSelectedDates(new Date(date)) != -1) {
                        self.hasSelectedDay = true;
                        self._setSelectedDay($item, date);
                    }
                });
            }
            return this;
        },
        _setToday: function (tag) {
            var
                self = this,
                today = Date.parse(new Date(new Date().toDateString()));

            self.$monthItem
                .removeClass(_constant.MONTH_ITEM_TODAY_CLASS);

            self.$monthItems.some(function (item, index) {
                var $item = $(item),
                    date = $item.attr("data-start") - 0;
                if (date === today) {
                    self.$monthItems[index]
                        .addClass(_constant.MONTH_ITEM_TODAY_CLASS);
                    if (tag === "todayClick" || !self.hasSelectedDay && !self.$monthItems[index].hasClass(_constant.ITEM_DISABLED_CLASS)) {
                        self.hasToday = true;
                        self.$monthItems[index]
                            .attr("tabindex", '0')

                            .focus();
                    }
                    return true;
                }
                return false;
            });

            return self;
        },
        _setSelectedDay: function ($item, date) {
            var
                self = this,
                dateIndex = -1,
                selectedDate = new Date(date);

            self.oldSelectedDate = [].concat(self.options.selectedDate);
            if (Array.isArray(self.options.selectedDate) && self.options.selectedDate.length > 0) {
                if ($item.hasClass(_constant.ITEM_DISABLED_CLASS)) {
                    dateIndex = self._getIndexOfSelectedDates(selectedDate);
                    if (dateIndex != -1) {
                        self.options.selectedDate.splice(dateIndex, 1);
                    }
                    return self;
                }
            }
            self._setMonthItemSelection($item);

            return self;
        },
        /**Jump to the specified month(index start from 0)
         * @param {number} index month 
         */
        _goToMonth: function (month, e) {
            var
                self = this,
                year = self.year,
                today = new Date();
            self._oldMonth = self.month;
            //如果是当前月，选中当前天
            if (today.getFullYear() != year || today.getMonth() != month) {
                today = this._makeDate(year, month, 1);
            }
            this.displayDate = today;
            self._generateView(today);
            self._onMonthChange(e);
            return self;
        },
        _setTabIndex: function () {
            /* 
             * search queue: selectedDate > today > current month first enable date
             */
            var self = this;
            if (!this.hasSelectedDay && !this.hasToday) {
                this.$monthItems.some(function (item) {
                    var $item = $(item);
                    if (!$item.hasClass(_constant.ITEM_DISABLED_CLASS)) {
                        $item.attr("tabindex", "0").focus();
                        self.hasEnableDay = true;
                        return true;
                    }
                    return false;
                });
            }
            if (!this.hasEnableDay && !this.hasSelectedDay && !this.hasToday) {
                self.$monthViewContent.attr("tabindex", "0").focus();
            }
            return this;
        },
        _createMonthView: function () {
            var
                h = -1,
                i = 0,
                j,
                first = this.options.firstDayOfWeek,
                index = 0,
                html = [];

            html[++h] = '<div class="' + _constant.MONTH_VIEW_CONTAINER + '" id="' + this.monthViewId + '">';

            html[++h] = '<div class="' + _constant.MONTH_VIEW_HEADER_CLASS + '">';
            html[++h] = '<table class="' + _constant.MONTH_VIEW_TABLE_CLASS + '" cellspacing="0" cellpadding="0">';
            //创建标题（星期日~星期六）
            html[++h] = '<thead>';
            html[++h] = '<tr>';
            for (; i < 7; i++) {
                html[++h] = '<th class="' + _constant.MONTH_HEADER_ITEM_CLASS + '" unselectable="on" role="columnheader">' + $$.I18N.calendar.shortweeks[(i + first) % 7] + '</th>';
            }
            html[++h] = '</tr role="row">';
            html[++h] = '</thead>';
            html[++h] = '</table>';
            html[++h] = '</div>';

            html[++h] = '<div class="' + _constant.MONTH_VIEW_CONTENT_CLASS + '" id="' + this.monthViewContentId + '">';
            html[++h] = '<table class="' + _constant.MONTH_VIEW_TABLE_CLASS + '" cellspacing="0" cellpadding="0" role="grid" aria-activedescendant="' + this.selectedDayId + '">';
            html[++h] = '<tbody>';
            for (i = 0; i < 6; i++) {
                j = 0;
                html[++h] = '<tr role="row">';
                for (; j < 7; j++) {
                    index = i * 7 + j;
                    html[++h] = '<td class="' + _constant.MONTH_ITEM_CLASS + '" data-index="' + index + '" role="gridcell" tabIndex="-1" aria-readonly="true">';
                    html[++h] = '  <div class="' + _constant.MONTH_ITEM_TEXT_CLASS + '" data-index="' + index + '"></div>';
                    html[++h] = '  <div class="' + _constant.MONTH_ITEM_CIRCLE_CLASS + '" data-index="' + index + '" ></div>';
                    html[++h] = '</td>';
                }
                html[++h] = '</tr>';
            }
            html[++h] = '</tbody>';
            html[++h] = '</table>';
            html[++h] = '</div>';
            if (this.options.hasToday) {
                html[++h] = this._createToday();
            }
            html[++h] = '</div>';

            return html.join('');
        },
        _onMonthChange: function (e) {
            this.Handler("onMonthChange", e, {
                first: new Date(this.calendarDays[0].date),
                last: new Date(this.calendarDays[41].date),
                start: new Date(this.calendarDays[this.past].date),
                end: new Date(this.calendarDays[this.future].date)
            });
            return this;
        },
        _clearMonthItemSelection: function () {
            this.$monthItem
                .removeClass(_constant.MONTH_ITEM_SELECTED_CLASS)
                .attr({
                    "tabindex": -1,
                    "aria-selected": false
                });
            this.$monthItem.each(function () {
                if ($(this).hasClass(_constant.ITEM_DISABLED_CLASS)) {
                    $(this).removeAttr("tabindex");
                }
            });
            return this;
        },
        _setMonthItemSelection: function ($item) {
            $item.addClass(_constant.MONTH_ITEM_SELECTED_CLASS)
                .attr({
                    "tabindex": 0,
                    "aria-selected": true,
                    "aria-disabled": false
                })
                .focus();
        },
        _clickSetSelectedDay: function ($selectedItem, e) {
            var
                self = this,
                dateIndex = -1;
            self.selectedDate = new Date($selectedItem.attr("data-start") - 0);

            if ($selectedItem.hasClass(_constant.ITEM_DISABLED_CLASS)) {
                return false;
            }

            switch (self.options.mode) {
                case 'single':
                    self._clearMonthItemSelection();
                    self.options.selectedDate = self.selectedDate;
                    self._setMonthItemSelection($selectedItem);
                    break;
                case 'multiple':
                    dateIndex = self._getIndexOfSelectedDates(self.selectedDate);
                    if (dateIndex != -1) {
                        self.options.selectedDate.splice(dateIndex, 1);
                        $selectedItem.toggleClass(_constant.MONTH_ITEM_SELECTED_CLASS)
                            .attr("aria-selected", false);
                    } else {
                        self.options.selectedDate.push(self.selectedDate);
                        self._setMonthItemSelection($selectedItem);
                    }
                    break;
                case 'range':
                    var selectedDate = self.options.selectedDate;
                    //TODO:check enabledDate start,end
                    if ($.isEmptyObject(selectedDate) || !selectedDate.start || selectedDate.start && selectedDate.end) {
                        self.options.selectedDate.start = self.selectedDate;
                        self.options.selectedDate.end = null;
                    } else {
                        if (self.selectedDate.getTime() > selectedDate.start.getTime()) {
                            self.options.selectedDate.end = self.selectedDate;
                        } else {
                            self.options.selectedDate.end = self.options.selectedDate.start;
                            self.options.selectedDate.start = self.selectedDate;
                        }
                    }
                    self._setRangeModeSelectedDate();
                    break;
            }
            self._onChange(e);
        },
        _clearTime: function (date) {
            if (date instanceof Date) {
                return new Date(date.toDateString());
            }
            return date;
        },
        _setRangeModeSelectedDate: function () {
            //remove selected style 
            var start = this.options.selectedDate ? this.options.selectedDate.start : null,
                end = this.options.selectedDate ? this.options.selectedDate.end : null;
            this.$monthItems.forEach(function (item) {
                var $this = $(item);

                $this
                    .removeClass(_constant.MONTH_ITEM_SELECTED_CLASS)
                    .removeClass(_constant.MONTH_ITEM_SELECTED_START_CLASS)
                    .removeClass(_constant.MONTH_ITEM_SELECTED_END_CLASS)
                    .removeClass(_constant.MONTH_ITEM_SELECTED_RANGE_CLASS)
                    .removeClass(_constant.MONTH_ITEM_SHADOW)
                    .attr({
                        "tabindex": -1,
                        "aria-selected": false
                    });

            });
            //set selectedDate selected style
            start = this._clearTime(start);
            end = this._clearTime(end);
            if (start) {
                var startDateString = start.toDateString();
                this.hasSelectedDay = true;
                start = Date.parse(start);
                this.$monthView.find('td[data-start="' + start + '"]')
                    .addClass(_constant.MONTH_ITEM_SELECTED_CLASS)
                    .addClass(_constant.MONTH_ITEM_SELECTED_START_CLASS)
                    .attr({
                        "tabindex": 0,
                        "aria-label": $$.I18N.datepicker.from + ' ' + startDateString
                    })
                    .focus();
            }
            if (end) {
                var endDateString = end.toDateString();
                this.hasSelectedDay = true;
                end = Date.parse(end);
                this.$monthView.find('td[data-start="' + start + '"]')
                    .addClass(_constant.MONTH_ITEM_SHADOW);
                this.$monthView.find('td[data-start="' + end + '"]')
                    .addClass(_constant.MONTH_ITEM_SELECTED_CLASS)
                    .addClass(_constant.MONTH_ITEM_SELECTED_END_CLASS)
                    .addClass(_constant.MONTH_ITEM_SHADOW)
                    .attr({
                        "tabindex": 0,
                        "aria-label": $$.I18N.datepicker.from + ' ' + endDateString
                    })
                    .focus();
                this.$monthItems.forEach(function (item) {
                    var $this = $(item),
                        data = $this.attr("data-start");
                    if (start < data && data < end) {
                        $this
                            .addClass(_constant.MONTH_ITEM_SELECTED_CLASS)
                            .addClass(_constant.MONTH_ITEM_SELECTED_RANGE_CLASS);
                    }
                });
            }

        },
        _getIndexOfSelectedDates: function (date) {
            var _dates = [];
            if (Array.isArray(this.options.selectedDate)) {
                this.options.selectedDate.map(function (d) {
                    _dates.push(Date.parse(d.toDateString()));
                });
            }
            if (this.options.selectedDate instanceof Date) {
                var tempDate = new Date(this.options.selectedDate.toDateString());
                _dates.push(Date.parse(tempDate));
            }
            return _dates.indexOf(Date.parse(date));
        },
        _validAssert: function (start, end) {
            return Date.parse(new Date(start.toDateString())) > Date.parse(new Date(end.toDateString()));
        },
        _onChange: function (e) {
            var
                self = this,
                oldDate = self.oldDate;
            //if (self.options.mode === "range" && !self.options.selectedDate.end)
            //    return false;           
            this.Handler('onChange', e, {
                oldValue: oldDate,
                newValue: self.options.selectedDate
            });
        }
    });
    //Year View Function
    $.extend($.aui.calendar.prototype, {
        _createYearView: function () {
            var
                self = this,
                h = -1,
                i = 0,
                j,
                html = [];
            html[++h] = '<div id="' + self.yearViewId + '" class="' + _constant.YEAR_VIEW_CLASS + '">';
            html[++h] = '<table role="grid" class="' + _constant.YEAR_VIEW_CONTENT_CLASS + '"  cellspacing="0" cellpadding="0">';
            html[++h] = '<tbody>';
            for (; i < 3; i++) {
                html[++h] = '<tr role="row">';
                j = 0;
                for (; j < 4; j++) {
                    html[++h] = '<td class="' + _constant.YEAR_ITEM_CLASS + '" data-index="' + (i * 4 + j) + '" role="gridcell"><div>' + $$.I18N.calendar.shortMonths[i * 4 + j] + '</div></td>';
                }
                html[++h] = '</tr>';
            }
            html[++h] = '</tbody>';
            html[++h] = '</table>';
            html[++h] = '</div>';

            return html.join('');
        },
        _setSelectedMonth: function (month) {
            var self = this;

            self.$yearItem
                .removeClass(_constant.YEAR_SELECTED_CLASS);
            self.$yearItem.attr("tabindex", '-1');
            self.$yearItems[month]
                .attr("tabindex", 0)
                .focus()
                .addClass(_constant.YEAR_SELECTED_CLASS);

            return self;
        },
        _onYearItemKeydown: function (e) {
            var
                self = e.data,
                index = e.currentTarget.getAttribute("data-index") - 0,
                canChange = true,
                isChangeView = false;
            e.stopPropagation();
            e.preventDefault();

            switch (e.which) {
                case $.ui.keyCode.LEFT:
                    index--;
                    break;
                case $.ui.keyCode.UP:
                    index = index - 4;
                    break;
                case $.ui.keyCode.RIGHT:
                    index++;
                    break;
                case $.ui.keyCode.DOWN:
                    index = index + 4;
                    break;
                case $.ui.keyCode.ENTER:
                    self._selectedMonth(index);
                    canChange = false;
                    break;
                case $.ui.keyCode.HOME:
                    index = 0;
                    break;
                case $.ui.keyCode.END:
                    index = 11;
                    break;
                case $.ui.keyCode.PAGE_UP:
                    --self.year;
                    isChangeView = true;
                    break;
                case $.ui.keyCode.PAGE_DOWN:
                    ++self.year;
                    isChangeView = true;
                    break;
                default:
                    canChange = false;
                    break;
            }

            if (canChange) {
                if (index >= 0 && index < 12 || isChangeView) {
                    self._updateTitle()
                        ._setSelectedMonth(index);
                }
            }
        },
        _onYearItemClick: function (e) {
            e.data._selectedMonth(this.getAttribute("data-index") - 0);
        },
        _selectedMonth: function (month) {
            this._goToMonthView()
                ._goToMonth(month)
                ._setToday();
                //._onChange();
        }
    });
    //Decade View Function
    $.extend($.aui.calendar.prototype, {
        /**
         * 获取十年视图的起始年
         * return {number} 起始年
         */
        _getDecadeStart: function (year) {
            var
                self = this,
                reste = year % 10,
                start = 0;

            if (year < 10) {
                //起始年视图公元1年到10年
                start = -1;
            } else if (reste == 9) {
                start = year - year % 10 + 9;
            } else {
                start = year - year % 10 - 1;
            }

            self._decadeStart = start;
            self._decadeEnd = start + 11;

            return start;
        },
        _createDecadeView: function () {
            var
                self = this,
                start = self._getDecadeStart(self.year),
                h = -1,
                i = 0,
                year = 0,
                j,
                html = [];

            html[++h] = '<div id="' + self.decadeViewId + '" class="' + _constant.DECADE_VIEW_CLASS + '">';
            html[++h] = '<table role="grid" class="' + _constant.DECADE_VIEW_CONTENT_CLASS + '"  cellspacing="0" cellpadding="0">';
            html[++h] = '<tbody>';
            for (; i < 3; i++) {
                html[++h] = '<tr role="row">';
                j = 0;
                for (; j < 4; j++) {
                    year = start + i * 4 + j;
                    year = year > 0 ? year : '';
                    html[++h] = '<td class="' + _constant.DECADE_ITEM_CLASS + '" data-year="' + year + '" data-index="' + (i + j) + '" role="gridcell"><div>' + year + '</div></td>';
                }
                html[++h] = '</tr>';
            }
            html[++h] = '</tbody>';
            html[++h] = '</table>';
            html[++h] = '</div>';
            return html.join('');
        },
        _goToDecadeView: function () {
            var self = this;
            self.options.displayMode = self.view = _view.decade;
            self.$monthView.hide();
            self.$yearView.hide();
            self.$decadeView.show();

            self._updateDecadeItem(self.year)
                ._updateTitle()
                ._setSelectedYear(self.year);

            return self;
        },
        _setSelectedYear: function (year) {
            var self = this;

            self.$decadeItem
                .removeClass(_constant.YEAR_SELECTED_CLASS);
            self.$decadeItem.attr("tabindex", '-1');
            self.$decadeItem.filter('[data-year="' + year + '"]')
                .attr("tabindex", 0)
                .addClass(_constant.YEAR_SELECTED_CLASS)
                .focus();

            return self;
        },
        _onDecadeKeydown: function (e) {
            var
                self = e.data,
                year = e.currentTarget.getAttribute("data-year") - 0,
                start = self._decadeStart,
                end = self._decadeEnd,
                canChange = true,
                isUpdateItem = false;
            e.stopPropagation();
            e.preventDefault();

            switch (e.which) {
                case $.ui.keyCode.LEFT:
                    year--;
                    break;
                case $.ui.keyCode.UP:
                    year -= 4;
                    break;
                case $.ui.keyCode.RIGHT:
                    year++;
                    break;
                case $.ui.keyCode.DOWN:
                    year += 4;
                    break;
                case $.ui.keyCode.ENTER:
                    canChange = false;
                    $(e.currentTarget).trigger("click");
                    break;
                case $.ui.keyCode.HOME:
                    year = start + 1;
                    break;
                case $.ui.keyCode.END:
                    year = end - 1;
                    break;
                case $.ui.keyCode.PAGE_UP:
                    year -= 10;
                    isUpdateItem = true;
                    break;
                case $.ui.keyCode.PAGE_DOWN:
                    year += 10;
                    isUpdateItem = true;
                    break;
                default:
                    canChange = false;
                    break;
            }
            if (canChange) {
                if (isUpdateItem) {
                    self._updateTitle()
                        ._updateDecadeItem(year)
                        ._setSelectedYear(year);
                }
                else if (year >= start && year <= end) {
                    self._setSelectedYear(year);
                }
            }
        },
        _onDecadeClick: function (e) {
            var self = e.data;
            self.year = this.getAttribute("data-year") - 0;
            self._goToYearView();
        },
        _updateDecadeItem: function (year) {
            var
                self = this,
                i = 0,
                start = self._getDecadeStart(year),
                year = 0,
                c = self.$decadeItems.length;

            for (; i < c; i++) {
                year = start + i;
                year = year > 0 ? year : '';
                self.$decadeItems[i].children().text(year);
                self.$decadeItems[i].attr("data-year", year);
            }

            return self;
        }
    });

})(AUI, jQuery);