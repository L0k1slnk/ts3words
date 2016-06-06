chrome.manifest = chrome.app.getDetails();
// var scripts = chrome.manifest.content_scripts[0].js;
// var styles = chrome.manifest.content_scripts[0].css;

var ts3Words = {
    active: true,
    counter: 0,
    panel: {
        state: 'default', // 'default', 'collapsed', 'stuckTop', 'stuckBottom', 'stuckLeft', 'stuckRight'
        position: {
            top: '30px',
            bottom: 'auto',
            left: 'auto',
            right: '30px'
        }
    }
}

function updateStatus() {
    if (ts3Words.active) {
        turnOff();
        ts3Words.active = true;
    }
    else {
        turnOn();
        ts3Words.active = false;
    }
}

turnOn();

chrome.browserAction.onClicked.addListener(function () {
    updateStatus();
});

// chrome.management.onDisabled.addListener(function(ExtensionInfo) { // TROLOLOLO need a second extension to monitor this MUHAHHAHAHA
//     alert('disable');
//     turnOff();
// });
//
// chrome.management.onEnabled.addListener(function(ExtensionInfo) {
//     alert('enable');
//     turnOn();
// });


// loadContentScriptInAllTabs(injectIntoTab);



function turnOn() {
    chrome.browserAction.setBadgeText({text: "ON"});
    chrome.browserAction.setIcon({path: "images/icon16.png"});
    // chrome.tabs.onActivated.addListener(tabListener);
    chrome.runtime.onMessage.addListener(domListener);
    chrome.tabs.getSelected(null, function (tab) {
        var currentWindow = tab.windowId;
        var currentTab = tab.id;
        if (!tab.url.match(/(chrome):\/\//gi)) {
            injectIntoTab(tab);
        }
        loadContentScriptInAllTabs(injectIntoTab, {windowId: currentWindow, tabId: currentTab});
    });

    // loadContentScriptInAllTabs(showPanels);

    console.log('turnOn()');
}

function turnOff() {
    chrome.browserAction.setBadgeText({text: ""});
    chrome.browserAction.setIcon({path: "images/icon16_inactive.png"});
    // chrome.tabs.onActivated.removeListener(tabListener);
    chrome.runtime.onMessage.removeListener(domListener);
    loadContentScriptInAllTabs(removePanels);
    console.log('turnOff()');
}


function tabListener(activeInfo) {
    chrome.tabs.sendMessage(activeInfo.tabId, {message: "tab activated", ts3Words: ts3Words});
    ts3Words.counter++;
    console.log('activate tab');
}

function domListener(request, sender, sendResponse) {
    console.log(request);
    if (request.message === "domready") {
        sendResponse({ts3Words: ts3Words});
        ts3Words.counter++;
    }
}

function loadContentScriptInAllTabs(callback, params) {
    chrome.windows.getAll({'populate': true}, function (windows) {
        for (var i = 0; i < windows.length; i++) {
            var tabs = windows[i].tabs;
            var currentWindow = windows[i];
            for (var j = 0; j < tabs.length; j++) {
                var currentTab = currentWindow.tabs[j];
                if (params && params.windowId == currentWindow && params.tabId == currentTab) {
                    continue;
                }
                else {
                    if (!currentTab.url.match(/(chrome):\/\//gi)) {
                        callback(currentTab, params);
                    }
                }
            }
        }
    });
}
function injectIntoTab(tab) {
    chrome.tabs.executeScript(tab.id, {
        file: "scripts/content.js",
        runAt: "document_end"
    });
    chrome.tabs.insertCSS(tab.id, {
        file: "styles/style.css"
    });

    console.log('inject into ' + tab.id + ' tab');

}

function removePanels(tab) {
    chrome.tabs.executeScript(tab.id, {
        code: "var panel = document.getElementById('__ts3w-control-panel'); if(panel) panel.remove();"
    });
}
// function showPanels(tab) {
//     chrome.tabs.executeScript(tab.id, {
//         code: "var panel = document.getElementById('__ts3w-control-panel'); console.log(panel); if(panel) panel.style.display = 'block';"
//     });
// }