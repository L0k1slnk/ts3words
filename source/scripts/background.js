function Ts3Words() {
    this.active = false;
    this.counter = 0;
}

var ts3Words = new Ts3Words();


function updateStatus() {
    ts3Words.active = !ts3Words.active;
    if (ts3Words.active) {
        chrome.browserAction.setBadgeText({text: "ON"});
        chrome.browserAction.setIcon({path: "images/icon16.png"});

        addListeners();
    }
    else {
        chrome.browserAction.setBadgeText({text: ""});
        chrome.browserAction.setIcon({path: "images/icon16_inactive.png"});

        removeListeners();
    }

}

chrome.browserAction.onClicked.addListener(function () {
    updateStatus();
});


function addListeners() {
    // on activate tab (if tab loaded after runing ext)
    chrome.tabs.onActivated.addListener(tabListener);

    // from content on Dom Ready
    chrome.runtime.onMessage.addListener(domListener);
}

function removeListeners() {
    chrome.tabs.onActivated.removeListener(tabListener);
    chrome.runtime.onMessage.removeListener(domListener);
}

function tabListener(activeInfo) {
    chrome.tabs.sendMessage(activeInfo.tabId, {message: "tab activated", counter: ts3Words.counter});
    ts3Words.counter++;
    console.log('3 words activat tab');
}

function domListener(request, sender, sendResponse) {
    console.log(request);
    if (request.message === "domready") {
        sendResponse({counter: ts3Words.counter});
        ts3Words.counter++;
    }
}