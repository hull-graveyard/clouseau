var phantom = require('node-phantom');
var Q = require('q');

/**
 * Starts the execution of clouseau.
 * Your initial checkpoints  MUST be ste before calling this
 */
function start(url) {
  "use strict";

  /**
   * Runs all the tests necesaary to check the deploy is valid
   */
  function testCorrectDeploy(dfd, ph, err, status) {
    if (status !== "success") {
      dfd.reject('Unable to open the page');
    }
    dfd.resolve(this);
    ph.exit();
  }



  var dfd = Q.defer();
  if (!url) {
    dfd.reject("No URL to be examined was provided.");
  }

  /**
   * This is where it all begins: PhantomJS creation, page creation, and initialization of the widgets
   */
  phantom.create(function (err, ph) {
    if (err) {
      return dfd.reject(new Error('Unable to create PhantomJS: ' + err));
    }
    return ph.createPage(function (err, page) {
      if (err) {
        return dfd.reject(new Error('Unable to create the page PhantomJS: ' + err));
      }
      page.open(
        url,
        testCorrectDeploy.bind(page, dfd, ph)
      );
    });
  });

  return dfd.promise;
}



module.exports = {
  Q: Q,
  start: start,
  /**
   * Generates alert handlers at specific delays, with specific expectations and messages
   * We must have a function that returns a new copy ofthe function everytime, because we can't rebind a bound function
   */
  addCheckpoint: function (expectation, delay, description) {
    "use strict";

    description = description ? '"' + description + '"' : '_unnamed_';
    return function (page) {
      Q.delay(delay).done(function () {
        if (!this.promise.isFulfilled()) {
          this.reject(new Error(['Expectation',  description,  'not fulfilled.'].join(' ')));
        }
      }.bind(this));

      expectation.call(this, page);
      return this.promise;
    }.bind(Q.defer());
  }
};
