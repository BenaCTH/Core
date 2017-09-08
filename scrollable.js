(function ($) {

    $.widget('aui.scrollable', {
        options: {
            scrollOffset: 60,
            preventDefault: true,
            stopPropagation: false
        },

        _create: function () {
            this.element.on('mousewheel' + this.eventNamespace, this, this._onMouseWheel);
        },
        _onMouseWheel: function (e) {
            var
                self = e.data,
                delta = 1;

            if (self.options.stopPropagation) {
                e.stopPropagation();
            }

            if (self.options.preventDefault) {
                e.preventDefault();
            }

            if (e.deltaY > 0) {
                delta = -1;
            }

            self.element[0].scrollTop += delta * self.options.scrollOffset;
        }
    });
}(jQuery));