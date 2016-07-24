import Chrome from 'chrome-remote-interface';

let delay = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, 400);
  })
}

export default class ChromeHelper {
  constructor(port, url) {
    this.port = port;
    this.url = (url)? url: "about:blank";
    this.chrome;
    this.tab;
  }
  startupChrome() {
    return Promise.all([
      Chrome.New({port: this.port, url: this.url}),
      Chrome({port: this.port})
    ]).then((results) => {
      this.tab = results[0];
      this.chrome = results[1];
      return results;
    })
  }
  shutdownChrome(tab) {
    tab = (!tab || !tab.hasOwnProperty('id'))? this.tab: tab;
    return Chrome.Close({port: this.port, id: tab.id}).then(delay);
  }
  isTabOpen(tab) {
    tab = (!tab || !tab.hasOwnProperty('id'))? this.tab: tab;
    return Chrome.List({port:9222}).then((tabsList) => {
      let result = tabsList.findIndex((element) => {
        return (element.id === tab.id);
      });
      return (result > -1);
    });
  }
  closeAllTabs() {
    return Chrome.List({port: this.port})
      .then((tabList) => {
        return tabList.reduce((previousTab, currentTab, currentIndex, tabArray) => {
          return this.shutdownChrome(currentTab);
        }, Promise.resolve());
      })
  }
}
