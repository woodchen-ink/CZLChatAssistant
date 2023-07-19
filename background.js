let currentWindowId;
let currentTabId;

function createContextMenu() {
  var contexts = ['selection'];
  for (let i = 0; i < contexts.length; i++) {
    let context = contexts[i];
    chrome.contextMenus.create({ "title": "🤔询问", "contexts": [context], "id": 'ask' });
    chrome.contextMenus.create({ "title": "✍️写作", "contexts": [context], "id": 'write' });
    chrome.contextMenus.create({ "title": "📊思维导图", "contexts": [context], "id": 'mind-map' });
  }
}

chrome.runtime.onInstalled.addListener(createContextMenu);
chrome.runtime.onStartup.addListener(createContextMenu);

chrome.contextMenus.onClicked.addListener(function (info, tab) {
  let id = info.menuItemId;
  let selectionText = info.selectionText;
  let url;
  switch (id) {
    case 'ask':
      url = `https://chat.czl.net/chat?send=1&prompt=${encodeURIComponent(selectionText)}`;
      break;
    case 'write':
      url = `https://chat.czl.net/writing?prompt=${encodeURIComponent(selectionText)}`;
      break;
    case 'mind-map':
      url = `https://chat.czl.net/mind-map?prompt=${encodeURIComponent(selectionText)}`;
      break;
  }

  openTab(url);
});

chrome.action.onClicked.addListener(function (tab) {
  openTab('https://chat.czl.net');
});

function openTab(url) {
  if (currentWindowId === undefined) {
    chrome.windows.create({
      url: url,
      type: 'popup',
      width: 1080,
      height: 824,
      left: 100,
      top: 100
    }, function(window) {
      currentWindowId = window.id;
      currentTabId = window.tabs[0].id;
    });
  } else {
    chrome.windows.get(currentWindowId, function(window) {
      if (chrome.runtime.lastError || !window) {
        chrome.windows.create({
          url: url,
          type: 'popup',
          width: 1080,
          height: 824,
          left: 100,
          top: 100
        }, function(window) {
          currentWindowId = window.id;
          currentTabId = window.tabs[0].id;
        });
      } else {
        chrome.tabs.get(currentTabId, function(tab) {
          if (chrome.runtime.lastError || !tab) {
            chrome.tabs.create({ windowId: currentWindowId, url: url }, function(tab) {
              currentTabId = tab.id;
            });
          } else {
            chrome.tabs.update(currentTabId, { url: url });
          }
          chrome.windows.update(currentWindowId, { focused: true });
        });
      }
    });
  }
}
