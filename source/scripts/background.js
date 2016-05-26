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

        chrome.tabs.onActivated.addListener(function (activeInfo) {
            chrome.tabs.sendMessage(activeInfo.tabId, {message: "tab activated", counter: ts3Words.counter});
            ts3Words.counter++;
            console.log('3 words activat tab');
        });

        // from content on Dom Ready
        chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
            console.log(request);
            if (request.message === "domready") {
                sendResponse({counter: ts3Words.counter});
                ts3Words.counter++;
            }
        });
    }
    else {
        chrome.browserAction.setBadgeText({text: ""});
        chrome.browserAction.setIcon({path: "images/icon16_inactive.png"});

        chrome.tabs.onActivated.removeListener(function () {
            console.log('3 words OFF tab listener');
        });

        chrome.runtime.onMessage.removeListener();
    }

}

chrome.browserAction.onClicked.addListener(function () {
    updateStatus();
});


