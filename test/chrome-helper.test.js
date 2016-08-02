/* eslint-disable func-names, new-cap,  */
import chai from 'chai';
import Chrome from 'chrome-remote-interface';
import Topmarks from 'topmarks';
import ChromeHelper from '../src/chrome-helper';

chai.should();

describe('ChromeHelper', () => {
  it('should startup a chrome connection and open a tab', function (done) {
    this.timeout(120000);
    const chromeHelper = new ChromeHelper(9222, 'http://google.com');
    chromeHelper.startupChrome()
      .then(() => chromeHelper.isTabOpen())
      .then((results) => results.should.be.true)
      .then(() => chromeHelper.closeTab())
      .then(() => done())
      .catch((err) => { throw err; });
  });
  it('should close the connection with chrome', function (done) {
    this.timeout(120000);
    const chromeHelper = new ChromeHelper(9222, 'http://google.com');
    chromeHelper.startupChrome()
      .then(() => chromeHelper.isTabOpen())
      .then((results) => results.should.be.true)
      .then(() => chromeHelper.shutdownChrome(chromeHelper.tab))
      .then(() => chromeHelper.isTabOpen(chromeHelper.tab))
      .then((results) => results.should.be.false)
      .then(() => done())
      .catch((err) => { throw err; });
  });
  it('should fail if correct port not specified', function (done) {
    this.timeout(120000);
    const chromeHelper = new ChromeHelper(9223, 'http://google.com');
    chromeHelper.startupChrome()
      .then(() => done())
      .catch((err) => {
        // eslint-disable-next-line no-unused-expressions
        err.should.exist;
        done();
      });
  });
  it('should return error if checking for tab and something else goes wrong', function (done) {
    this.timeout(120000);
    const chromeHelper = new ChromeHelper();
    chromeHelper.startupChrome()
      .then(() => chromeHelper.startupChrome())
      .then(() => {
        chromeHelper.port = 9223;
        return chromeHelper.shutdownChrome(chromeHelper.tab);
      })
      .catch((err) => {
        // eslint-disable-next-line no-unused-expressions
        err.should.exist;
        done();
      });
  });
  it('should close all the tabs', function (done) {
    this.timeout(120000);
    const chromeHelper = new ChromeHelper();
    chromeHelper.startupChrome()
      .then(() => chromeHelper.startupChrome())
      .then((tabList) => tabList.length.should.be.above(0))
      .then(() => chromeHelper.closeAllTabs())
      .then(() => Chrome.List())
      .then((tabList) => tabList.length.should.equal(0))
      .then(() => done())
      .catch((err) => {
        throw err;
      });
  });
  describe('demo', () => {
    it('should work as described in the readme', function (done) {
      this.timeout(120000);
      const topmarks = new Topmarks();
      topmarks.register('sample-plugin')
      .then(() => {
        topmarks.registrations.hasOwnProperty('samplePlugin').should.equal(true);
      })
      .then(done)
      .catch((err) => {
        throw err;
      });
    });
  });
});
