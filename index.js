var phantom = require('node-phantom');
var Q = require('q');

/**
 * Generates onAlert functions so we can expect various alert messages
 */
function onAlertCheck(expected, page) {
  "use strict";
  return function (txt) {
    if (txt !== expected) {
      return this.reject(new Error('Unexpected message: ' + txt));
    }
    this.resolve(page);
    return this;
  }.bind(this);
}



function run() {
  "use strict";

  /**
   * Runs all the tests necesaary to check the deploy is valid
   */
  function testCorrectDeploy(dfd, err, status) {
    if (status !== "success") {
      dfd.reject('Unable to open the page');
    }
    dfd.resolve(this);
  }



  var dfd = Q.defer();

  /**
   * This is where it all begins: PhantomJS creation, page creation, and initialization of the widgets
   */
  phantom.create(function (err, ph) {
    return ph.createPage(function (err, page) {
      page.open(
        process.env.HUBOT_ALIVE_URL,
        testCorrectDeploy.bind(page, dfd)
      );
    });
    dfd.then(ph.exit, function () {});
  });

  return dfd.promise;
}



module.exports = {
  Q: Q,
  start: run,
  /**
   * Generates alert handlers at specific delays, with specific expectations and messages
   * We must have a function that returns a new copy ofthe function everytime, because we can't rebind a bound function
   */
  addCheckpoint: function (expectation, delay) {
    return function (expected, delay, page) {
      Q.delay(delay).done(function () {
        if (!this.promise.isFulfilled()) {
          this.reject(new Error('Expectation "' + expected + '" not fulfilled.'));
        }
      }.bind(this));

      page.onAlert = onAlertCheck.call(this, expected, page);
      return this.promise;
    }.bind(Q.defer(), expectation, delay);
  }
};
