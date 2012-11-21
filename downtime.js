/*!
 * jQuery downtime plugin
 * version 0.2
 * Author: Rob Griffiths <rob@bytespider.eu> http://github.com/bytespider/downtime
 * Licence: MIT license
*/

/*
 * Copyright (c) 2012 Rob Griffiths
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

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
                    time: null,
                    intervalFrequency: 1000 /* 1 second */,
                    type: 'countdown' /* countup */,
                    autostart: true,
                    complete: null,
                    hoursFormat: timeFormat,
                    minutesFormat: timeFormat,
                    secondsFormat: timeFormat,
                }, options);

                if (null == options.time) {
                    $.error('missing option time passed to jQuery.downtime');
                    return this;
                }

                if (!/^count(up|down)$/.test(options.type)) {
                    $.error('type ' +  options.type + ' is not a valid jQuery.downtime count type');
                    return this;
                }

                this.each(function () {
                    var $this = $(this);

                    $this.data('options', options);
                    count_types[options.type].init($this);

                    var time = $this.data('time');
                    var intervalFrequency = parseInt($this.data('options').intervalFrequency, 10);

                    $this.bind('downtime.update', update).trigger('downtime.update', {
                        item: $this,
                        hours: hours(time, intervalFrequency),
                        minutes: minutes(time, intervalFrequency),
                        seconds: seconds(time, intervalFrequency),
                        time: time
                    });
                });

                if (options.autostart) {
                    methods.start.call(this);
                }

                return this;
            },
            option: function (option, value) {
                var options = $(this).data('options') || {};

                if (null != value) {
                    // set
                    options[option] = value;
                    return $(this).data('options', options);
                }

                // get
                return option in options ? options[option] : null;
            },
            start: function () {
                return this.each(function () {
                    $this = $(this);

                    if ($this.data('timeout_id')) {
                        // already running
                        return;
                    }

                    var intervalFrequency = parseInt($this.data('options').intervalFrequency, 10);
                    var timeout_id = setInterval(function () {
                        var options = $this.data('options');
                        var time = count_types[options.type].update($this);

                        if (count_types[options.type].finished($this)) {
                            $this.trigger('downtime.complete', {
                                item: $this
                            });

                            if (null != options.complete) {
                                options.complete.call($this);
                            }

                            methods.stop.call($this);
                        }

                        $this.trigger('downtime.update', {
                            item: $this,
                            hours: hours(time, intervalFrequency),
                            minutes: minutes(time, intervalFrequency),
                            seconds: seconds(time, intervalFrequency),
                            time: time
                        });

                    }, intervalFrequency);
                    $this.data('timeout_id', timeout_id);
                });
            },
            pause: function () {
                return this.each(function () {
                    if ($(this).data('timeout_id')) {
                        clearInterval($(this).data('timeout_id'));
                    }
                });
            },
            stop: function () {
                return this.each(function () {
                    $this = $(this);

                    $this.data('time', parseInt($this.data('options').time, 10));
                    if ($(this).data('timeout_id')) {
                        clearInterval($this.data('timeout_id'));
                    }
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


        function hours(timestamp, resolution) {
            return Math.floor(timestamp / (resolution/1000) / 3600);
        }

        function minutes(timestamp, resolution) {
            return Math.floor((timestamp / (resolution/1000) / 60) % 60);
        }

        function seconds(timestamp, resolution) {
            return Math.floor(timestamp / (resolution/1000) % 60);
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