var tmpl = '<ts3w id="__ts3w-control-panel" class="__ts3w-control-panel __ts3w-control-panel--processing"><ts3w class="__ts3w-control-panel__header"><ts3w class="__ts3w-control-panel__header-title __ts3w-control-panel__header-title--default">Definition</ts3w><ts3w class="__ts3w-control-panel__header-title __ts3w-control-panel__header-title--collapsed">Mother - Mama (ma-ma)</ts3w></ts3w><ts3w class="__ts3w-control-panel__body"><ts3w class="__ts3w-control-panel__figure"><img src="http://dreamatico.com/data_images/mother/mother-7.jpg" alt="Mother" class="__ts3w-control-panel__figure-image"></ts3w><ts3w class="__ts3w-control-panel__definition"><ts3w class="__ts3w-control-panel__definition-current">Mother</ts3w><ts3w class="__ts3w-control-panel__definition-translit">Mama</ts3w><ts3w class="__ts3w-control-panel__definition-transcription">(ma-ma)</ts3w></ts3w><ts3w class="__ts3w-control-panel__example">I learned that my <ts3w class="__ts3w-style __ts3w-style--strong">mama</ts3w> came from an amazing family. </ts3w><ts3w class="__ts3w-control-panel__example">In her old country, my <ts3w class="__ts3w-style __ts3w-style--strong">mama</ts3w> saw a very poor blind woman with her young daughter.</ts3w><ts3w class="__ts3w-control-panel__example">    My <ts3w class="__ts3w-style __ts3w-style--strong">mama</ts3w> cooks the best pie I ever tried. </ts3w><ts3w class="__ts3w-control-panel__counter"></ts3w></ts3w></ts3w>';
var controlPanelId = '#__ts3w-control-panel';
var ts3Words = {};
console.log('LOADDDDD');
if ($(controlPanelId).length) $(controlPanelId).remove();
chrome.runtime.sendMessage({message: "domready"}, function (response) {
    if (response) {
        ts3Words = response.ts3Words;
        if (ts3Words.active) {
            $(tmpl).appendTo('body');
            addPanelAppereance($(controlPanelId));
            $('.__ts3w-control-panel__counter').html(response.ts3Words.counter);
            $(controlPanelId).addClass('__ts3w-control-panel--' + ts3Words.state);
            $(controlPanelId).removeClass('__ts3w-control-panel--processing');
        }

        // $.get(chrome.extension.getURL('../content.html'), function (data) {
        //     if($(controlPanelId).length) $(controlPanelId).remove();
        //     $(data).appendTo('body');
        //     $('.__ts3w-control-panel__counter').html(response.ts3Words.counter);
        //     ts3Words = response.ts3Words;
        //     addPanelAppereance($(controlPanelId));
        //     $(controlPanelId).removeClass('__ts3w-control-panel--processing');
        //
        // });
    }
});
// update info on activate tab
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.message === "tab activated") {
        $('.__ts3w-control-panel__counter').html(request.ts3Words.counter);
        ts3Words = request.ts3Words;
        $(controlPanelId).removeClass('__ts3w-control-panel--processing');
    }
});


function addPanelAppereance($controlPanel) {
    $controlPanel.draggable({
        addClasses: false,
        handle: '.__ts3w-control-panel__header',
        containment: "window",
        scroll: false
    });

    /*****************************************
     *
     *               panel handlers
     *
     *****************************************/

    $('.__ts3w-control-panel__header').off('dblclick.ts3wCollapse').on('dblclick.ts3wCollapse', function (e) {
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

}

