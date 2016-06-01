chrome.manifest = chrome.app.getDetails();

function Ts3Words() {
    this.active = false;
    this.counter = 0;
    this.panelCollapsed = false;
}
var ts3Words = new Ts3Words();


function updateStatus() {
    ts3Words.active = !ts3Words.active;
    if (ts3Words.active) {
        turnOn();
    }
    else {
        turnOff();
    }

}

chrome.browserAction.onClicked.addListener(function () {
    updateStatus();
});

function turnOn() {
    // on activate tab (if tab loaded after runing ext)
    chrome.browserAction.setBadgeText({text: "ON"});
    chrome.browserAction.setIcon({path: "images/icon16.png"});
    chrome.tabs.onActivated.addListener(tabListener);
    // from content on Dom Ready
    chrome.runtime.onMessage.addListener(domListener);
    console.log('turnOn()');
    // loadContentScriptInAllTabs();
}

function turnOff() {
    chrome.browserAction.setBadgeText({text: ""});
    chrome.browserAction.setIcon({path: "images/icon16_inactive.png"});
    chrome.tabs.onActivated.removeListener(tabListener);
    chrome.runtime.onMessage.removeListener(domListener);
}

function tabListener(activeInfo) {
    chrome.tabs.sendMessage(activeInfo.tabId, {message: "tab activated", ts3Words: ts3Words});
    ts3Words.counter++;
    console.log('3 words activat tab');
}

function domListener(request, sender, sendResponse) {
    console.log(request);
    if (request.message === "domready") {
        sendResponse({ts3Words: ts3Words});
        ts3Words.counter++;
    }
}

function loadContentScriptInAllTabs() {
    chrome.windows.getAll({'populate': true}, function (windows) {
        for (var i = 0; i < windows.length; i++) {
            var tabs = windows[i].tabs;
            var currentWindow = windows[i];
            for (var j = 0; j < tabs.length; j++) {
                var currentTab = currentWindow.tabs[j];
                injectIntoTab(currentTab);
                // Skip chrome:// and https:// pages
                if (!currentTab.url.match(/(chrome|https):\/\//gi)) {
                    // injectIntoTab(currentTab);
                    // chrome.tabs.executeScript(currentTab.id, {
                    //     code: 'document.body.style.backgroundColor="red"'
                    // });
                }
            }
        }
    });
}
var injectIntoTab = function (tab) {
    var scripts = chrome.manifest.content_scripts[0].js;
    var styles = chrome.manifest.content_scripts[0].css;
    // var i = 0, s = scripts.length;
    // for( ; i < s; i++ ) {
    chrome.tabs.executeScript(tab.id, {
        file: scripts[0],
        allFrames: true,
        runAt: "document_end"

    });
    chrome.tabs.insertCSS(tab.id, {
        file: styles[0]
    });
    // }
}