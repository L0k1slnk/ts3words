var controlPanelId = '#__ts3w-control-panel';

$(function () {
    chrome.runtime.sendMessage({message: "domready"}, function (response) {
        if (response) {
            $.get(chrome.extension.getURL('../content.html'), function (data) {
                $(data).appendTo('body');
                addPanelAppereance($(controlPanelId));
            });
        }
    });
}); //Dom ready

// update info on activate tab
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.message === "tab activated") {
        var $controlPanel = $(controlPanelId);
        $controlPanel.text(request.counter);
    }
});


function addPanelAppereance($controlPanel) {
    $controlPanel.draggable({
        addClasses: false,
        handle: '.__ts3w-control-panel__header'
    });
}