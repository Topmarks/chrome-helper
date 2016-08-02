/* eslint-disable new-cap */
import Chrome from 'chrome-remote-interface';

/**
 *  Private: makes a delay a promise
 *
 *  ## Example
 *
 *     this.closeTab(tab).then(delay);
 *     // it takes chrome a couple seconds to realize a tab has closed.
 *
 *  Returns a {Promise}
 */
const delay = () =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 400);
  });
const tabNotOpenError = 'No valid tab provided as a parameter or set to this.tab';
/**
 * Topmark ChromeHelper
 */
export default class ChromeHelper {
  /**
   *  Public: initiates ChromeHelper and pass defaults through
   *
   *  * `port` an (optional) {Int} of the debugging port the browser is using
   *  * `url` an (optional) {String} of the url. Often used when opening new tabs.
   */
  constructor(port = 9222, url = 'about:blank') {
    this.port = port;
    this.url = url;
  }
  /**
   *  Public: opens a new tab (using the constructor port and url) and creates
   *  a new chrome connection. The results are returned as an array and set on
   *  the class instance as `this.tab` and `this.chrome`.
   *
   *  ## Example
   *
   *     const chromeHelper = new ChromeHelper();
   *     chromeHelper.startupChrome().then((results) => {
   *       console.log(results[0]); // the newly opened tab.
   *       console.log(results[1]); // the chrome connection.
   *     });
   *
   *  Returns a {Promise} which resolves with an {Array} of results.
   *  [0] is the tab opened, [1] is the chrome connection.
   */
  startupChrome() {
    return Promise.all([
      Chrome.New({ port: this.port, url: this.url }),
      Chrome({ port: this.port }),
    ]).then((results) => {
      this.tab = results[0];
      this.chrome = results[1];
      return results;
    });
  }
  /**
   *  Public: checks if there is a valid tab as a parameter or set on the instance.
   *
   *  * `tab` an optional {Tab} object. Defaults to this.tab set by `startupChrome`.
   *
   *  ## Example
   *
   *     this.checkTab(tab).then(this.closeTab);
   *
   *  Returns a {Promise}; rejects if no valid tab available.
   */
  checkTab(tab = false) {
    return new Promise((resolve, reject) => {
      if (tab && tab.hasOwnProperty('id')) {
        resolve(tab);
      } else if (this.hasOwnProperty('tab') && this.tab.hasOwnProperty('id')) {
        resolve(this.tab);
      }
      reject(tabNotOpenError);
    });
  }
  /**
   *  Public: closes a tab (if not specificed it uses `chromeHelper.tab` if available).
   *
   *  * `tab` an optional {Tab} object. Defaults to this.tab set by `startupChrome`.
   *
   *  ## Example
   *
   *     const chromeHelper = new ChromeHelper();
   *     chromeHelper.startupChrome().then(() => chromeHelper.shutdownChrome());
   *
   *  Returns a {Promise}.
   */
  shutdownChrome(tab) {
    return this.checkTab(tab, this.tab)
      .then((validTab) => this.closeTab(validTab))
      .then(delay)
      .then(() => {
        delete this.tab;
      });
  }
  /**
   *  Public: closes a tab (if not specificed it uses `chromeHelper.tab` if available).
   *
   *  * `tab` an optional {Tab} object. Defaults to this.tab set by `startupChrome`.
   *
   *  ## Example
   *
   *     const chromeHelper = new ChromeHelper();
   *     chromeHelper.startupChrome().then(() => chromeHelper.shutdownChrome());
   *
   *  Returns a {Promise}.
   */
  closeTab(tab) {
    return this.checkTab(tab)
      .then((validTab) => Chrome.Close({ port: this.port, id: validTab.id }));
  }
  /**
   *  Public: checks if a tab is open.
   *
   *  * `tab` an optional {Tab} object. Defaults to this.tab set by `startupChrome`.
   *
   *  ## Example
   *
   *     const chromeHelper = new ChromeHelper();
   *     chromeHelper.isTabOpen().then((result) => console.log(result));
   *     // a boolean
   *
   *  Returns a {Promise} which resolves to a {Bool}.
   */
  isTabOpen(tab) {
    return new Promise((resolve, reject) => {
      let chromeTab = tab;
      this.checkTab(tab)
        .then((checkedTab) => {
          chromeTab = checkedTab;
        })
        .then(() => Chrome.List({ port: this.port }))
        .then((tabsList) => {
          const result = tabsList.findIndex((element) => (element.id === chromeTab.id));
          resolve(result > -1);
        })
        .catch((err) => {
          if (err === tabNotOpenError) {
            resolve(false);
          }
          reject(err);
        });
    });
  }
  /**
   *  Public: closes all the open tabs in chrome, then adds a delay to make to
   *  ensure Chrome can accurately report what tabs are open.
   *
   *  ## Example
   *
   *     const chromeHelper = new ChromeHelper();
   *     chromeHelper.closeAllTabs()
   *
   *  Returns a {Promise}.
   */
  closeAllTabs() {
    return Chrome.List({ port: this.port })
      .then((tabList) => tabList
        .reduce((previousTab, currentTab) =>
          this.closeTab(currentTab),
        Promise.resolve())
      ).then(delay);
  }
}
