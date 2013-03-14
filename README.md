# Clouseau

> Tracks the correct execution of any app (yours or not) by asserting invariants while running the app into PhantomJS.
>
> No modification of your codebase required as long as you can identify invariants during the execution.

![Clouseau](clouseau.png)


## What is it for ?

This is very useful for integration testing, when you want to make sure that your components fit well one with the other.

Because mocking in your unit tests is not enough, you have to check against real production code in integration tests.

It can also easily be used as a monitoring tool if you have a long-running app, or want to ensure your freshly deployed app fulfills its most basic (therefore critical!) tasks.

## How to use it ?

* Set up the page in which you want to run the tests
* At the required places, do calls to `alert()` with a specific message
* install `clouseau` in your project by running `npm install clouseau-js`
* Build a Node.js script that uses `clouseau` as follows:

    ```javascript
    var clouseau = require('clouseau-js');
    
    function alertCheck(expectedMessage) {
      return function (page) {
        var dfd = this; // `this` is a deferred! \o/
        page.onAlert = function (txt) {
          if (txt !== expectedMessage) {
            return dfd.reject(new Error("Unexpected message: " + txt));
          }
          return dfd.resolve(page);
        };
      };
    }

    var check1 = clouseau.addCheckpoint(alertCheck('MESSAGE 1'), 10000); // timeout in ms
    var check2 = clouseau.addCheckpoint(alertCheck('MESSAGE2'), 40000);
    
    var url = "http://your.domain.com/end/point"
    
    clouseau.start(url)
      .then(check1)
      .then(check2)
      .then(function () { console.log('OK'); }, function () { console.log('Fail'); });

## API

The module exports 3 properties:

* `Q`: The very excellent [Q](http://github.com/kriskowal/q) library
* `addCheckpoint(fn, timeout)`: To add your own checkpoint
* `run`: Start loading the page in PhantomJS and verifying the checkpoints

## License

MIT

