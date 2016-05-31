var controlPanelId = '#__ts3w-control-panel';
var ts3Words = {};

$(function () {
    chrome.runtime.sendMessage({message: "domready"}, function (response) {
        if (response) {
            $.get(chrome.extension.getURL('../content.html'), function (data) {
                $(data).appendTo('body');
                $('.__ts3w-control-panel__counter').html(response.ts3Words.counter);
                ts3Words = response.ts3Words;
                addPanelAppereance($(controlPanelId));
                $(controlPanelId).removeClass('__ts3w-control-panel--processing');

            });
        }
    });
}); //Dom ready

// update info on activate tab
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.message === "tab activated") {
        $('.__ts3w-control-panel__counter').html(request.ts3Words.counter);
        ts3Words = response.ts3Words;
        $(controlPanelId).removeClass('__ts3w-control-panel--processing');
    }
});


function addPanelAppereance($controlPanel) {
    $controlPanel.draggable({
        addClasses: false,
        handle: '.__ts3w-control-panel__header'
    });
}

/*****************************************
 *
 *               document handlers
 *
 *****************************************/

$(document).on('dblclick', '.__ts3w-control-panel__header', function (e) {
    if (ts3Words.panelCollapsed) {
        $('.__ts3w-control-panel__body').slideDown(100);
        $(controlPanelId).removeClass('__ts3w-control-panel--collapsed');
    }
    else {
        $('.__ts3w-control-panel__body').slideUp(100);
        $(controlPanelId).addClass('__ts3w-control-panel--collapsed');
    }
    ts3Words.panelCollapsed = !ts3Words.panelCollapsed;
});