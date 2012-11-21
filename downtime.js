!function($) {
    $.fn.downtime = function (method) {

        var count_types = {
            'countup': {
                init: function (item) {
                    item.data('time', 0);
                },
                update: function (item) {
                    var time = parseInt(item.data('time'), 10);
                    item.data('time', ++time);

                    return time;
                },
                finished: function (item) {
                    return parseInt(item.data('time'), 10) == parseInt(item.data('options').time, 10);
                }
            },
            'countdown': {
                init: function (item) {
                    var time = parseInt(item.data('options').time, 10);
                    item.data('time', time);
                },
                update: function (item) {
                    var time = parseInt(item.data('time'), 10);
                    item.data('time', --time);

                    return time;
                },
                finished: function (item) {
                    return parseInt(item.data('time'), 10) == 0;
                }
            }
        };

        var methods = {
            init: function (options) {
                options = $.extend({
                    time: 60000,
                    intervalFequency: 1000 /* 1 second */,
                    type: 'countdown' /* countup */,
                    autostart: true,
                    complete: null,
                    hoursFormat: timeFormat,
                    minutesFormat: timeFormat,
                    secondsFormat: timeFormat,
                }, options);

                if (!/^count(up|down)$/.test(options.type)) {
                     $.error('type ' +  options.type + ' is not a valid jQuery.downtime count type');
                     return this;
                }

                this.each(function () {
                    var $this = $(this);

                    $this.data('options', options);
                    count_types[options.type].init($this);

                    var time = $this.data('time');
                    $this.bind('timer.update', update).trigger('timer.update', {
                        item: $this,
                        hours: hours(time),
                        minutes: minutes(time),
                        seconds: seconds(time)
                    });
                });

                if (options.autostart) {
                    methods.start.call(this);
                }

                return this;
            },
            start: function () {
                return this.each(function () {
                    $this = $(this);

                    var intervalFequency = parseInt($this.data('options').intervalFequency, 10);
                    var timeout_id = setInterval(function () {
                        var options = $this.data('options');
                        var time = count_types[options.type].update($this);

                        if (count_types[options.type].finished($this)) {
                            $this.trigger('timer.complete', {
                                item: $this
                            });

                            if (null != options.complete) {
                                options.complete.call($this);
                            }

                            methods.stop.call($this);
                        }

                        $this.trigger('timer.update', {
                            item: $this,
                            hours: hours(time),
                            minutes: minutes(time),
                            seconds: seconds(time)
                        });

                    }, intervalFequency);
                    $this.data('timeout_id', timeout_id);
                });
            },
            pause: function () {
                return this.each(function () {
                    clearInterval($(this).data('timeout_id'));
                });
            },
            stop: function () {
                return this.each(function () {
                    $this = $(this);

                    $this.data('time', parseInt($this.data('options').time, 10));
                    clearInterval($this.data('timeout_id'));
                });
            },
            show: function () {
                return this.each(function () {
                    $(this).timer('resume');
                    $(this).show.apply(this, [].slice.call(arguments, 0));
                });
            },
            hide: function () {
                return this.each(function () {
                    $(this).timer('pause');
                    $(this).hide.apply(this, [].slice.call(arguments, 0));
                });
            }
        };

        if (methods[method]) {
            return methods[method].apply(this, [].slice.call(arguments, 1));
        } else if (typeof method === 'object' || ! method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' +  method + ' does not exist on jQuery.downtime');
        };


        function hours(timestamp) {
            return Math.floor(timestamp / 3600);
        }

        function minutes(timestamp) {
            return Math.floor((timestamp / 60) % 60);
        }

        function seconds(timestamp) {
            return Math.floor(timestamp % 60);
        }

        function update(event, data) {
            $('[data-bind="hours"]', $(this)).text((data.hours + '').replace(/^(\d)$/, '0$1'));
            $('[data-bind="minutes"]', $(this)).text((data.minutes + '').replace(/^(\d)$/, '0$1'));
            $('[data-bind="seconds"]', $(this)).text((data.seconds + '').replace(/^(\d)$/, '0$1'));
        }

        function timeFormat(time) {
            return (time + '').replace(/^(\d)$/, '0$1');
        }
    };
}(jQuery);