module.exports = {
  configurations: {
    chrome: {
      target: 'chrome.app',
      width: 1366,
      height: 768,
      deviceScaleFactor: 1,
      mobile: false,
    },
  },
  diffingEngine: 'pixelmatch',
  pixelmatch: {
    threshold: 0.1,
  },
};
