var tmpl = '<ts3w id="__ts3w-control-panel" class="__ts3w-control-panel __ts3w-control-panel--processing"><ts3w class="__ts3w-control-panel__header"><ts3w class="__ts3w-control-panel__header-title __ts3w-control-panel__header-title--default">Definition <ts3w class="__ts3w-control-panel__header-icon __ts3w-control-panel__header-icon--settings"><svg viewBox="0 0 325.902 325.902"><path d="M289.486,169.775l36.416-6.423l-9.98-56.672l-36.406,6.415c-4.02-9.392-9.123-18.203-15.186-26.271l23.762-28.326 l-44.074-36.992l-23.77,28.315c-8.941-4.547-18.504-8.058-28.523-10.388V2.472h-57.549v36.961 c-10.004,2.33-19.572,5.841-28.521,10.388L81.908,21.507l-44.098,36.99l23.783,28.325c-6.061,8.069-11.188,16.881-15.195,26.273 l-36.404-6.415L0,163.352l36.439,6.423c0.557,10.344,2.344,20.35,5.23,29.887l-32,18.48l28.766,49.841l32.049-18.498 c6.918,7.389,14.725,13.949,23.219,19.507l-12.648,34.75l54.088,19.688l12.643-34.756c4.973,0.592,10.031,0.906,15.178,0.906 c5.125,0,10.184-0.314,15.158-0.906l12.65,34.755l54.074-19.685l-12.646-34.753c8.518-5.558,16.318-12.117,23.232-19.506 l32.043,18.498l28.773-49.84l-32.016-18.48C287.121,190.124,288.93,180.118,289.486,169.775z M108.582,162.868 c0-30.032,24.351-54.373,54.381-54.373c30.021,0,54.367,24.341,54.367,54.373c0,30.027-24.346,54.366-54.367,54.366 C132.934,217.234,108.582,192.895,108.582,162.868z"/></svg></ts3w></ts3w><ts3w class="__ts3w-control-panel__header-title __ts3w-control-panel__header-title--collapsed">Mother - Mama (ma-ma)</ts3w></ts3w><ts3w class="__ts3w-control-panel__body"><ts3w class="__ts3w-control-panel__content"><ts3w class="__ts3w-control-panel__figure"><img src="http://dreamatico.com/data_images/mother/mother-7.jpg" alt="Mother" class="__ts3w-control-panel__figure-image"></ts3w><ts3w class="__ts3w-control-panel__definition"><ts3w class="__ts3w-control-panel__definition-current">Mother</ts3w><ts3w class="__ts3w-control-panel__definition-translate">Mama</ts3w><ts3w class="__ts3w-control-panel__definition-translit">(ma-ma)</ts3w></ts3w><ts3w class="__ts3w-control-panel__examples"><ts3w class="__ts3w-control-panel__example">I learned that my <ts3w class="__ts3w-style __ts3w-style--strong">mama</ts3w> came from an amazing family. </ts3w><ts3w class="__ts3w-control-panel__example">In her old country, my <ts3w class="__ts3w-style __ts3w-style--strong">mama</ts3w> saw a very poor blind woman with her young daughter.</ts3w><ts3w class="__ts3w-control-panel__example">    My <ts3w class="__ts3w-style __ts3w-style--strong">mama</ts3w> cooks the best pie I ever tried. </ts3w></ts3w></ts3w><ts3w class="__ts3w-control-panel__info"><ts3w class="__ts3w-control-panel__table"><ts3w class="__ts3w-control-panel__table__row"><ts3w class="__ts3w-control-panel__table__row__td">all matches: </ts3w><ts3w class="__ts3w-control-panel__table__row__td __ts3w-allMatches">0</ts3w></ts3w><ts3w class="__ts3w-control-panel__table__row"><ts3w class="__ts3w-control-panel__table__row__td">visible matches: </ts3w><ts3w class="__ts3w-control-panel__table__row__td __ts3w-visibleMatches">0</ts3w></ts3w></ts3w></ts3w></ts3w></ts3w>';
var controlPanelId = '#__ts3w-control-panel';
var ts3Words = null;
console.log('LOADDDDD');
var numVisibleWords = 0;

if ($(controlPanelId).length) $(controlPanelId).remove();
chrome.runtime.sendMessage({message: "get data"}, function (response) {
    console.log('domready message from contentjs')
    if (response) {
        console.log('response in content from bg');
        if ($(controlPanelId).length) $(controlPanelId).remove();
        if (response.ts3Words.active) {
            console.log('status is ACTIVE from bg');
            $(tmpl).appendTo('body');
            ts3Words = JSON.parse(localStorage.getItem('ts3w'));
            if (!ts3Words) {
                ts3Words = response.ts3Words;
            }
            localStorage.setItem('ts3w', JSON.stringify(ts3Words));
            $(controlPanelId).css({
                top: ts3Words.panel.position.top,
                left: ts3Words.panel.position.left,
                bottom: ts3Words.panel.position.bottom,
                right: ts3Words.panel.position.right
            }).addClass('__ts3w-control-panel--' + ts3Words.panel.state);

            addPanelAppereance($(controlPanelId));
            $('.__ts3w-control-panel__counter').html(response.ts3Words.counter);
            // if(ts3Words.panel.state == 'collapsed'){
            //     $(controlPanelId).addClass('__ts3w-control-panel--' + ts3Words.panel.state);
            // }

            // $(controlPanelId).removeClass('__ts3w-control-panel--processing');
            updatePanelInfo(response.data[0]);
            removeFindedWords();
            searchWord(response.data[0].word);
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

chrome.runtime.onMessage.addListener(function (response, sender, sendResponse) {
    if (response.message === "tab activated") {
        // $('.__ts3w-control-panel__counter').html(request.ts3Words.counter);
        // ts3Words = request.ts3Words;
        // $(controlPanelId).removeClass('__ts3w-control-panel--processing');
        console.log('tab act callback');
        // searchWord(response.data[0].word);
    }

    // if (request.message === "deactivate plugin") {
    //     removeFindedWords();
    // }

});

/*****************************************
 *
 *               panel
 *
 *****************************************/


function addPanelAppereance($controlPanel) {
    $controlPanel.draggable({
        addClasses: false,
        handle: '.__ts3w-control-panel__header',
        containment: "window",
        scroll: false,
        drag: function (event, ui) {
            // console.log(ui);
        },
        stop: function (event, ui) {
            ts3Words.panel.position = {
                top: ui.position.top + 'px',
                bottom: 'auto',
                left: ui.position.left + 'px',
                right: 'auto'
            }
            localStorage.setItem('ts3w', JSON.stringify(ts3Words));
        }
    });

    /*****************************************
     *
     *               panel handlers
     *
     *****************************************/

    $('.__ts3w-control-panel__header').off('dblclick.ts3wCollapse').on('dblclick.ts3wCollapse', function (e) {
        if (ts3Words.panelCollapsed) {
            $(controlPanelId).removeClass('__ts3w-control-panel--collapsed').css({height: 'auto'});
            // $('.__ts3w-control-panel__body').slideDown(100, function () {
            //     $(controlPanelId).removeClass('__ts3w-control-panel--collapsed');
            // });

            ts3Words.panel.state = "default";
        }
        else {
            // $('.__ts3w-control-panel__body').slideUp(100, function () {
            //     $(controlPanelId).addClass('__ts3w-control-panel--collapsed');
            // });
            $(controlPanelId).addClass('__ts3w-control-panel--collapsed').css({height: 'auto'});
            ts3Words.panel.state = "collapsed";
        }
        ts3Words.panelCollapsed = !ts3Words.panelCollapsed;
        localStorage.setItem('ts3w', JSON.stringify(ts3Words));
    });
    $('.__ts3w-control-panel__header-icon').off('dblclick.ts3wSettings').on('dblclick.ts3wSettings', function (e) {
        return false;
    });
    $('.__ts3w-control-panel__header-icon').off('click.ts3wSettings').on('click.ts3wSettings', function (e) {
        e.stopPropagation();
        $(controlPanelId).toggleClass('__ts3w-control-panel--settings');
        return false;
    });

}

function updatePanelInfo(data) {
    $(controlPanelId).addClass('__ts3w-control-panel--processing');
    $(controlPanelId).find('.__ts3w-control-panel__header-title--collapsed').html(data.word + ' - ' + data.translation + ' (' + data.transliteration + ')');
    $(controlPanelId).find('.__ts3w-control-panel__definition-current').html(data.word);
    $(controlPanelId).find('.__ts3w-control-panel__definition-translate').html(data.translation);
    $(controlPanelId).find('.__ts3w-control-panel__definition-translit').html('(' + data.transliteration + ')');
    $(controlPanelId).find('.__ts3w-control-panel__figure-image').attr('src', data.imageurl);
    var examples = "";
    for (var i = 0; i < data.examples.length; i++) {
        examples += '<ts3w class="__ts3w-control-panel__example">' + data.examples[i] + '</ts3w>';
    }
    $(controlPanelId).find('.__ts3w-control-panel__examples').html(examples);
    $(controlPanelId).removeClass('__ts3w-control-panel--processing');
}


/*****************************************
 *
 *               search words
 *
 *****************************************/

function searchWord(word) {
    var options = {
        element: "ts3w",
        className: "__ts3w-word",
        filter: ['ts3w', 'aside', 'iframe', 'a', 'nav', 'footer'],
        accuracy: "exactly",
        diacritics: true,
        debug: true,
        each: function (el) {
            console.log($(el));
            checkVisibility($(el));
        },
        noMatch: function () {
            $(controlPanelId).find('.__ts3w-allMatches').html('Not found');
            console.log('No matches on this page');
        },
        done: function (num) {
            $(controlPanelId).find('.__ts3w-allMatches').html(num);
            console.log('finded ' + num + ' matches');
        }
    };
    $('body').mark(word, options);
}

function removeFindedWords() {
    var options = {
        element: "ts3w",
        className: "__ts3w-word"
    };
    $('body').unmark(options);
}

function checkVisibility($word) {
    if ($word.visible() && $word.is(':visible') && $word.css('visibility') != 'hidden' && $word.css('opacity') != 0) {
        $word.addClass('__ts3w-word--visible');
        numVisibleWords++;
        $(controlPanelId).find('.__ts3w-visibleMatches').html(numVisibleWords);
        console.log('visible - ', $word);
        console.log('words counter - ', numVisibleWords);
    }
    else {
        $word.removeClass('__ts3w-word--visible');
    }

}