import Configs from "/class/Configs.js"



chrome.cookies.getAll({}, (cookies) => {
  var cookieConfig = new Configs(cookies)
  // cookie on change event
  chrome.cookies.onChanged.addListener((info) => {
    // update cookie whenever match with cookie key in config and from bonadmin.com
    if (info.removed) {
      // update cookie in cookieConfig without remove cookie in browser
      cookieConfig.removeCookie(info.cookie.domain, info.cookie.name)
    } else {
      cookieConfig.addCookie(info.cookie)
    }
    // sync cookie with domain in configuration
    if (info.cookie.domain == '.bonadmin.com' && cookieConfig.getCookiesKey().includes(info.cookie.name)) {
      cookieConfig.updateCookie()
    }
  })
});

function focusOrCreateTab(url) {
  chrome.windows.getAll({"populate":true}, function(windows) {
    var existing_tab = null;
    for (var i in windows) {
      var tabs = windows[i].tabs;
      for (var j in tabs) {
        var tab = tabs[j];
        if (tab.url == url) {
          existing_tab = tab;
          break;
        }
      }
    }
    if (existing_tab) {
      chrome.tabs.update(existing_tab.id, {"selected":true});
    } else {
      chrome.tabs.create({"url":url, "selected":true});
    }
  });
}

chrome.browserAction.onClicked.addListener(function(tab) {
  var manager_url = chrome.extension.getURL("html/manager.html");
  focusOrCreateTab(manager_url);
});
