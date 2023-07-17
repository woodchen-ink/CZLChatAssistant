let currentWindowId;
let currentTabId;

chrome.runtime.onInstalled.addListener(function () {
  var contexts = ['selection'];
  for (let i = 0; i < contexts.length; i++) {
    let context = contexts[i];
    var title1 = "🤔询问选中项";
    chrome.contextMenus.create({
      "title": title1,
      "contexts": [context],
      "id": 'ask'
    });
    var title3 = "✍️进行写作";
    chrome.contextMenus.create({
      "title": title3,
      "contexts": [context],
      "id": 'write'
    });
    var title4 = "📊生成思维导图";
    chrome.contextMenus.create({
      "title": title4,
      "contexts": [context],
      "id": 'mind-map'
    });
  }
});

chrome.contextMenus.onClicked.addListener(function (info, tab) {
  let id = info.menuItemId;
  let selectionText = info.selectionText;
  let url;
  switch (id) {
    case 'ask':
      url = `https://chat.czl.net/chat?prompt=${selectionText}&send=1`;
      break;
    case 'write':
      url = `https://chat.czl.net/writing?prompt=${selectionText}`;
      break;
    case 'mind-map':
      url = `https://chat.czl.net/mind-map?prompt=${selectionText}`;
      break;
  }

  if (currentWindowId) {
    chrome.tabs.update(currentTabId, { url: url }).then(() => {
      chrome.windows.update(currentWindowId, { focused: true });
    });
  } else {
    chrome.windows.create({
      url: url,
      type: 'popup',
      width: 1080,
      height: 824,
      left: 100,
      top: 100
    }).then((window) => {
      currentWindowId = window.id;
      currentTabId = window.tabs[0].id;
      chrome.windows.update(currentWindowId, { focused: true });
    });
  }
});

chrome.action.onClicked.addListener(function (tab) {
  var url = 'https://chat.czl.net';
  if (currentWindowId) {
    chrome.tabs.update(currentTabId, { url: url }).then(() => {
      chrome.windows.update(currentWindowId, { focused: true });
    });
  } else {
    chrome.windows.create({
      url: url,
      type: 'popup',
      width: 1080,
      height: 824,
      left: 100,
      top: 100
    }).then((window) => {
      currentWindowId = window.id;
      currentTabId = window.tabs[0].id;
      chrome.windows.update(currentWindowId, { focused: true });
    });
  }
});
