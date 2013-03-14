# Clouseau

> Tracks that your app as a whole works as you expect it.
>
> The piece of cake that was missing in your integration testing strategy!

![Clouseau](clouseau.png)


## What is it for ?

This is very useful for integration testing, when you want to make sure that your components fit well one with the other.

Because mocking in your unit tests is not enough, you have to check against real production code in integration tests.

It can also easily be used as a monitoring tool if you have a long-running app, or want to ensure your freshly deployed app fulfills its most basic (therefore critical!) tasks.

## How does it work ?

Clouseau tracks invariants in a _live_ and _running_ app in phantomJS. Basically, this is integration testing, which means you should be able to find those invariants without any modification of your codebase.
Though it might be necessary from time to time, of course...

You define those invariants by defining functions, and decide how they should flow one with the other with the help of [Q](http://github.com/kriskowal/q).

## How to use it ?

* Find the page/app in which you want to test the invariants
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
* `start`: Start loading the page in PhantomJS and verifying the checkpoints

## License

MIT

