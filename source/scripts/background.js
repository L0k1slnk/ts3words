function Ts3Words() {
    this.active = false;
}

var ts3Words = new Ts3Words();

chrome.browserAction.setIcon({path: "images/icon16_inactive.png"});

function updateIcon() {
    ts3Words.active = !ts3Words.active;
    if (ts3Words.active) {
        chrome.browserAction.setBadgeText({text: "ON"});
        chrome.browserAction.setIcon({path: "images/icon16.png"});
    }
    else {
        chrome.browserAction.setBadgeText({text: ""});
        chrome.browserAction.setIcon({path: "images/icon16_inactive.png"});
    }

}

chrome.browserAction.onClicked.addListener(function () {
    updateIcon();
});