# Downtime

jQuery plugin for customisable timers and timed events.

## Usage

```javascript
$('#my-countdown-timer').downtime({
    time: 60,
    intervalFrequency: 1000,             /* how often the timer ticks, in milliseconds. Default: 1000 */
    type: 'countdown',                  /* or countup. Default: countdown */
    autostart: false,                   /* true to start the timer right away. Default: true */
    complete: function () {             /* Optional function to call when timer completes. */
        alert('YAY! All done.');
    },
    hoursFormat: function (time) {      /* Optional function to format the hours component */
        return time + 'hours';          /* Default: Returns component padded 2 digits */
    },
    minutesFormat: function (time) {    /* Optional function to format the minutes component */
        return time + 'minutes';        /* Default: Returns component padded 2 digits */
    },
    secondsFormat: function (time) {    /* Optional function to format the seconds component */
        return time + 's';              /* Default: Returns component padded 2 digits */
    }
});
```

### Simplest usage

    <div id="my-countdown-timer">
        <span data-bind="hours"></span> hours
        <span data-bind="minutes"></span> minutes
        <span data-bind="hours"></span> seconds
    </div>
    <script>
        $('#my-countdown-timer').downtime({time: 2700});
    </script>

## API Documentation

### Options

#### time

The length of time the timer will run form. This number depends on `intervalFrequency`, such that the resolution is increased or decreased.

##### Code examples:

Initialise the timer with the time option specified:

    $('.selector').downtime({time: 60});

Get or set the time option after initialisation:

    // getter
    var current_time = $('.selector').downtime('option', 'time');

    // setter
    $('.selector').downtime('option', 'time', 100);

#### intervalFrequency

How often in milliseconds the timer will update. Each tick will increment or decrement the time by 1.
The resolution of the timer can be incresed by setting an `intervalFrequency` higher than 1000, for instance an `intervalFrequency` of 1 means that `time` has a resolution of n*milliseconds whereas an `intervalFrequency` of 60000 means that `time` has a resolution of hours.

Default: 1000

##### Code examples:

Initialise the timer with the time option specified:

    $('.selector').downtime({intervalFrequency: 1000});

Get or set the intervalFrequency option after initialisation:

    // getter
    var interval_ms = $('.selector').downtime('option', 'intervalFrequency');

    // setter
    $('.selector').downtime('option', 'intervalFrequency', 1000);

#### type

If the timer is a countdown timer or a count up timer.

Default: 'countdown'

##### Code examples:

Initialise the timer with the type option specified:

    $('.selector').downtime({type: 'countup'});

#### autostart

If the timer is a countdown timer or a count up timer.

Default: true

##### Code examples:

Initialise the timer with the autostart option specified:

    $('.selector').downtime({autostart: false});

#### autostart

If the timer is a countdown timer or a count up timer.

Default: true

##### Code examples:

Initialise the timer with the autostart option specified:

    $('.selector').downtime({autostart: false});

#### hoursFormat

A function to format the hours component.

Default: `function (time) { return (time + '').replace(/^($\d)$/, '0$1'); }`

##### Code examples:

Initialise the timer with the hoursFormat option specified:

    $('.selector').downtime({hoursFormat: function (time) {
        return time + 'hours'
    }});

Get or set the hoursFormat option after initialisation:

    // getter
    var hours_formater = $('.selector').downtime('option', 'hoursFormat');

    // setter
    $('.selector').downtime('option', 'hoursFormat', function (time) {
        return time + 'hours'
    });

#### minutesFormat

A function to format the minutes component.

Default: `function (time) { return (time + '').replace(/^($\d)$/, '0$1'); }`

##### Code examples:

Initialise the timer with the minutesFormat option specified:

    $('.selector').downtime({minutesFormat: function (time) {
        return time + 'minutes'
    }});

Get or set the minutesFormat option after initialisation:

    // getter
    var minutes_formater = $('.selector').downtime('option', 'minutesFormat');

    // setter
    $('.selector').downtime('option', 'minutesFormat', function (time) {
        return time + 'minutes'
    });

#### secondsFormat

A function to format the seconds component.

Default: `function (time) { return (time + '').replace(/^($\d)$/, '0$1'); }`

##### Code examples:

Initialise the timer with the secondsFormat option specified:

    $('.selector').downtime({secondsFormat: function (time) {
        return time + 'seconds'
    }});

Get or set the secondsFormat option after initialisation:

    // getter
    var seconds_formater = $('.selector').downtime('option', 'secondsFormat');

    // setter
    $('.selector').downtime('option', 'secondsFormat', function (time) {
        return time + 'seconds'
    });


### Methods

#### start

Starts the timer if it isn’t already running.

##### Code examples:

Invoke the start method:

    $('.selector').downtime('start');

#### pause

Pauses a running timer.

##### Code examples:

Invoke the pause method:

    $('.selector').downtime('pause');

#### stop

Stops a running timer and resets the time.

##### Code examples:

Invoke the stop method:

    $('.selector').downtime('stop');

#### show

Show the DOM element containing the timer. Passing standard `.show()` arguments.

##### Code examples:

Invoke the show method:

    $('.selector').downtime('show', 'fast');

#### hide

Hide the DOM element containing the timer. Passing standard `.hide()` arguments.

##### Code examples:

Invoke the hide method:

    $('.selector').downtime('hide', 'fast', function () {
        alert('animation complete');
    });


### Events

##### complete(data)

Triggered when the timer reaches it’s goal.

##### Code examples:

Initialise the timer with the complete option specified:

    $('.selector').downtime({complete: function () {
        alert('All done!');
    }});

Get or set the complete option after initialisation:

    // getter
    var complete_callback = $('.selector').downtime('option', 'complete');

    // setter
    $('.selector').downtime('option', 'complete', function () {
        alert('All done!');
    });

#### downtime.update(event, data)
This event is triggered when any timer ticks.

- event: Event
- data:
    - item: Object
    - hours: Integer
    - minutes: Integer
    - seconds: Integer
    - time: Integer

##### Code examples:

    $(window).bind('downtime.update', function (event, data) {
        console.log('You have: ' + data.hours + ' hours ' + data.minutes + ' minutes ' + data.seconds ' seconds left to live');
    });

#### downtime.complete(event, data)
This event is triggered when any timer completes.

- event: Event
- data:
    - item: Object

##### Code examples:

    $(window).bind('downtime.complete', function (event, data) {
        console.log(data.item, 'completed timer');
    });