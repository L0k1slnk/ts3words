chrome.manifest = chrome.app.getDetails();
// var scripts = chrome.manifest.content_scripts[0].js;
// var styles = chrome.manifest.content_scripts[0].css;
var harcodedData = [
    {
        id: '0',
        learned: false,
        active: false,
        renderCount: 0,
        renderCap: 3,
        actionCount: 0,
        actionCap: 3,
        word: 'mom',
        type: 'word',
        language_from: 'en',
        language_to: 'ru',
        translation: 'мама',
        transliteration: 'mama',
        examples: ['My mama cooks the best pie I ever tried.'],
        imageurl: 'http://youmoms.org/wp-content/uploads/2015/12/mothers-happiness.jpg',//'language.jpg'

    }, {
        id: '1',
        learned: false,
        active: false,
        renderCount: 0,
        renderCap: 3,
        actionCount: 0,
        actionCap: 3,
        word: 'cat',
        type: 'word',
        language_from: 'en',
        language_to: 'ru',
        translation: 'кот',
        transliteration: 'kot',
        examples: ['My neghbours had a very cute red kot.'],
        imageurl: 'http://animaliaz-life.com/data_images/cat/cat8.jpg'
    }, {
        id: '2',
        learned: false,
        active: false,
        renderCount: 0,
        renderCap: 3,
        actionCount: 0,
        actionCap: 3,
        word: 'how',
        type: 'word',
        language_from: 'en',
        language_to: 'ru',
        translation: 'как',
        transliteration: 'kahk',
        examples: ['Kak do I get to the train station?'],
        imageurl: 'http://www.howdesign.com/wp-content/uploads/header-logo.png'
    }, {
        id: '3',
        learned: false,
        active: false,
        renderCount: 0,
        renderCap: 3,
        actionCount: 0,
        actionCap: 3,
        word: 'so',
        type: 'word',
        language_from: 'en',
        language_to: 'ru',
        translation: 'так',
        transliteration: 'tahk',
        examples: ['Tak you are from the USA?'],
        imageurl: 'https://yt3.ggpht.com/-UsWDpckUytU/AAAAAAAAAAI/AAAAAAAAAAA/xEj_G-KlTa8/s88-c-k-no-rj-c0xffffff/photo.jpg'
    }, {
        id: '4',
        learned: false,
        active: false,
        renderCount: 0,
        renderCap: 3,
        actionCount: 0,
        actionCap: 3,
        word: 'who',
        type: 'word',
        language_from: 'en',
        language_to: 'ru',
        translation: 'кто',
        transliteration: 'ktoh',
        examples: ['Ktoh wants to become a millionaire.'],
        imageurl: 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcSgYNEmNh6UUZdpAlje5S4BboAC-cwjoAzKsHUcH9M1l_bxHFNb'
    }, {
        id: '5',
        learned: false,
        active: false,
        renderCount: 0,
        renderCap: 3,
        actionCount: 0,
        actionCap: 3,
        word: 'there',
        type: 'word',
        language_from: 'en',
        language_to: 'ru',
        translation: 'там',
        transliteration: 'tahm',
        examples: ['I\'ll be tahm in half an hour.'],
        imageurl: 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcS_gMm4cnuzS_llC1qUVP1S55AXYKUsNQjycWRCGTauM6LmTscd'
    }, {
        id: '6',
        learned: false,
        active: false,
        renderCount: 0,
        renderCap: 3,
        actionCount: 0,
        actionCap: 3,
        word: 'house',
        type: 'word',
        language_from: 'en',
        language_to: 'ru',
        translation: 'дом',
        transliteration: 'dom',
        examples: ['Here\'s my dohm.'],
        imageurl: 'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcSeTaZydnQeebe9W9gXyG73bYYRl-WLYWAzFoWvuyTKUnR7A_NXLg'
    }, {
        id: '7',
        learned: false,
        active: false,
        renderCount: 0,
        renderCap: 3,
        actionCount: 0,
        actionCap: 3,
        word: 'then',
        type: 'word',
        language_from: 'en',
        language_to: 'ru',
        translation: 'потом',
        transliteration: 'puhtohm',
        examples: ['Go straight, puhtohm turn to the right.'],
        imageurl: 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQCo1HOjg5cdOPq5Adr0LLziWZAvV0CAOHNgC9WXm-MarM2l3nH'
    }, {
        id: '8',
        learned: false,
        active: false,
        renderCount: 0,
        renderCap: 3,
        actionCount: 0,
        actionCap: 3,
        word: 'place',
        type: 'word',
        language_from: 'en',
        language_to: 'ru',
        translation: 'место',
        transliteration: 'myehstah',
        examples: ['Our team won the first myehstah.'],
        imageurl: 'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcSIXYEePSh2zO3c8Mi7p0YlHgtOtPPHbA6jC5LcpmrO02wHklxGsA'
    }, {
        id: '9',
        learned: false,
        active: false,
        renderCount: 0,
        renderCap: 3,
        actionCount: 0,
        actionCap: 3,
        word: 'it',
        type: 'word',
        language_from: 'en',
        language_to: 'ru',
        translation: 'оно',
        transliteration: 'ahnoh',
        examples: ['Yes, time doesn\'t run, ahnoh flies really!'],
        imageurl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfj4QNLo63QEmQdtuOeQTi3S-HFNo9TEc7GPrlI4zu6qMNffavkA'
    }
];

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
        ts3Words.active = false;
    }
    else {
        turnOn();
        ts3Words.active = true;
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
    switch (request.message) {
        case "get data":
            sendResponse({ts3Words: ts3Words, data: harcodedData});
            ts3Words.counter++;
            break;
    }
}

function loadContentScriptInAllTabs(callback, params) {
    chrome.windows.getAll({'populate': true}, function (windows) {
        for (var i = 0; i < windows.length; i++) {
            var tabs = windows[i].tabs;
            var currentWindow = windows[i];
            for (var j = 0; j < tabs.length; j++) {
                var currentTab = currentWindow.tabs[j];
                if (params && params.tabId == currentTab.id) {
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

}

function removePanels(tab) {
    chrome.tabs.executeScript(tab.id, {
        code: "var panel = document.getElementById('__ts3w-control-panel'); if(panel) panel.remove();"
    });
    chrome.tabs.executeScript(tab.id, {
        code: "removeFindedWords();"
    });
}
// function showPanels(tab) {
//     chrome.tabs.executeScript(tab.id, {
//         code: "var panel = document.getElementById('__ts3w-control-panel'); console.log(panel); if(panel) panel.style.display = 'block';"
//     });
// }