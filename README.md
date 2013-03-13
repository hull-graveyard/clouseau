# Clouseau

> Follows the execution of a page/an app by expecting messages (sent via `alert()`) by running it in PhantomJS.

![Clouseau](clouseau.png)


## What is it for ?

This is very useful for integration testing, when you want to make sure that your components fit well one with the other.

Because mocking in your unit tests is not enough, you have to check against real production code in integration tests.

## How to use it ?

* Set up the page in which you want to run the tests.
* At the required places, do calls to `alert()` with a specific message.
* install `clouseau` in your project by running `npm install clouseau`
* Build a Node.js script that uses `phantomjs_app_checkpoint` as follows:

    var clouseau = require('clouseau');
    
    var check1 = clouseau.addCheckpoint('MESSAGE1', 10000); // timeout in ms
    var check2 = clouseau.addCheckpoint('MESSAGE2', 40000);
    
    clouseau.start()
      .then(check1)
      .then(check2)
      .then(function () { console.log('OK'); }, function () { console.log('Fail'); });

## API

The module exports 3 properties:

* `Q`: The very excellent [Q](kriskowal/q) library
* `addCheckpoint(msg, timeout)`: To add your own checkpoint
* `run`: Start loading the page in PhantomJS and verifying the checkpoints

## License

MIT

