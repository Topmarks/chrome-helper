# ChromeHelper

[![Build Status](https://travis-ci.org/Topmarks/chrome-helper.svg?branch=master)](https://travis-ci.org/Topmarks/chrome-helper) [![Coverage Status](https://coveralls.io/repos/github/Topmarks/chrome-helper/badge.svg?branch=master)](https://coveralls.io/github/Topmarks/chrome-helper?branch=master) [![npm version](https://badge.fury.io/js/chrome-helper.svg)](https://badge.fury.io/js/chrome-helper)

A helper class for [cyrus-and/chrome-remote-interface](https://github.com/cyrus-and/chrome-remote-interface)

Primarily designed to reduce repeated code in [Topmarks](http://github.com/topmarks/topmarks) plugins.

## Usage

Create a new instance of the `ChromeHelper` and pass the `port` and `url` to the constructor.

```js
var chromeHelper = new ChromeHelper(options.port, options.url);
```

Use `startupChrome()` to connect and open a new tab.

## Plugin Example

```js
var ChromeHelper = require('chrome-helper');

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
```
