# ChromeHelper

[![Build Status](https://travis-ci.org/Topmarks/chrome-helper.svg?branch=master)](https://travis-ci.org/Topmarks/chrome-helper) [![Code Climate](https://codeclimate.com/github/Topmarks/chrome-helper/badges/gpa.svg)](https://codeclimate.com/github/Topmarks/chrome-helper) [![Test Coverage](https://codeclimate.com/github/Topmarks/chrome-helper/badges/coverage.svg)](https://codeclimate.com/github/Topmarks/chrome-helper/coverage) [![Issue Count](https://codeclimate.com/github/Topmarks/chrome-helper/badges/issue_count.svg)](https://codeclimate.com/github/Topmarks/chrome-helper) [![Dependency Status](https://david-dm.org/Topmarks/chrome-helper.svg)](https://david-dm.org/Topmarks/chrome-helper) [![Inline docs](http://inch-ci.org/github/Topmarks/chrome-helper.svg?branch=master)](http://inch-ci.org/github/Topmarks/chrome-helper) [![npm version](https://badge.fury.io/js/chrome-helper.svg)](https://badge.fury.io/js/chrome-helper)

A helper class for [cyrus-and/chrome-remote-interface](https://github.com/cyrus-and/chrome-remote-interface)

Primarily designed to reduce repeated code in [Topmarks](http://github.com/Topmarks/chrome-helper) plugins.

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
