var ChromeHelper = require('../../../src/chrome-helper');

var samplePlugin = function samplePlugin(app, options) {
  var chromeHelper = new ChromeHelper(options.port, options.url);
  return chromeHelper.startupChrome().then(function (results) {
    // Do some stuff
    return Promise.resolve(results);
  }).then(function () {
    return chromeHelper.shutdownChrome();
  }).catch(console.log);
};

samplePlugin.attributes = {
  name: 'samplePlugin'
};

module.exports = samplePlugin;
