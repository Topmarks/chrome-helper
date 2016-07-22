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
  shutdownChrome() {
    return Chrome.Close({port: this.port, id: this.tab.id}).then(delay);
  }
  isTabOpen(tab) {
    if (!tab || !tab.hasOwnProperty('id')) {
      tab = this.tab;
    }
    return Chrome.List({port:9222}).then((tabsList) => {
      let result = tabsList.findIndex((element) => {
        return (element.id === tab.id);
      });
      return (result > -1);
    });
  }
}
