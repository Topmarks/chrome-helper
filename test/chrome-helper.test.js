import chai from 'chai';
import Chrome from 'chrome-remote-interface';
import Topmarks from "topmarks";

let ChromeHelper = require(`../${require('../package.json').main}`);
chai.should();

describe('ChromeHelper', () => {
  it('should startup a chrome connection and open a tab', function (done) {
    this.timeout(20000)
    let chromeHelper = new ChromeHelper(9222,"http://google.com");
    chromeHelper.startupChrome()
      .then(() => chromeHelper.isTabOpen())
      .then((results) => results.should.be.true)
      .then(() => chromeHelper.shutdownChrome())
      .then(() => done())
      .catch(console.log);
  });
  it('should close the connection with chrome', function (done) {
    this.timeout(20000)
    let chromeHelper = new ChromeHelper(9222,"http://google.com");
    chromeHelper.startupChrome()
      .then(() => chromeHelper.isTabOpen())
      .then((results) => results.should.be.true)
      .then(() => chromeHelper.shutdownChrome())
      .then(() => chromeHelper.isTabOpen())
      .then((results) => results.should.be.false)
      .then(() => done())
      .catch(console.log);
  });
  it('should fail if correct port not specified', function(done) {
    this.timeout(20000)
    let chromeHelper = new ChromeHelper(9223,"http://google.com");
    chromeHelper.startupChrome()
      .then(() => done())
      .catch((err) => {
        err.should.exist;
        done();
      });
  });
  describe('demo', () => {
    it('should work as described in the readme', function(done) {
      this.timeout(20000)
      let topmarks = new Topmarks();
      topmarks.register('sample-plugin')
      .then(() => {
        topmarks.registrations.hasOwnProperty('samplePlugin').should.be.true;
      })
      .then(done)
      .catch(console.log);
    });
  });
});
