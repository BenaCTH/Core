 var methods = {
    /**
		 * 获取当前使用浏览器名称以及版本。
		 * @method checkBrowser
		 * @return {Object} 返回浏览器信息对象。name为当前浏览器名称，version为当前浏览器版本。
		 */
        checkBrowser: function () {
            var browsers = {
                IE: "MSIE"
            }, index = navigator.userAgent.indexOf(browsers.IE), obj = {};
            if (index >= 0) {
                obj.name = browsers.IE;
                obj.version = navigator.userAgent.substr(index + 5, 3);
                return obj;
            }
        },
        /**
		 * 判断元素的滚动条是否已经显示
		 * @method isScroll
		 * @param {jQuery} 设置滚动条的jquery对象
		 */
        isScroll: function (scroll) {
            var
			//滚动条元素的视区高度
			scrollHeight,
			//滚动条子元素的高度和
			childrenHeight = 0,
			//返回值
			result = false,
			//循环
			i = 0,
			//子元素的个数
			childrenCount;
            if (scroll !== undefined) {
                scrollHeight = scroll.height();
                childrenCount = scroll.children().length;
                for (; i < childrenCount; i++) {
                    childrenHeight += $(scroll.children()[i]).outerHeight();
                }

                if (scrollHeight < childrenHeight) {
                    result = true;
                }

            }

            return result;
        },
        isHorizontalScroll: function (scroll) {
            var
			//滚动条元素的视区高度
			scrollWidth,
			//滚动条子元素的高度和
			childrenWidth = 0,
			//返回值
			result = false,
			//循环
			i = 0,
			//子元素的个数
			childrenCount;
            if (scroll !== undefined) {
                scrollWidth = scroll.width();
                childrenCount = scroll.children().length;
                for (; i < childrenCount; i++) {
                    childrenWidth += $(scroll.children()[i]).width();
                }

                if (scrollWidth < childrenWidth) {
                    result = true;
                }

            }

            return result;
        }
      }
