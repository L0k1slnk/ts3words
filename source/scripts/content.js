$.fn.extend({
    animateCss: function (animationName) {
        var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        $(this).addClass('animated ' + animationName).one(animationEnd, function () {
            $(this).removeClass('animated ' + animationName);
        });
    }
});

var svgFilter = '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" class="__ts3w-svg-filters"><defs><filter><feTurbulence type="fractalNoise" baseFrequency="0.000001" numOctaves="1" result="warp" /><feOffset dx="-90" dy="-90" result="warpOffset" /><feDisplacementMap xChannelSelector="R" yChannelSelector="G" scale="30" in="SourceGraphic" in2="warpOffset" /></filter></defs></svg>';
var controlPanelId = '#__ts3w-control-panel';
var ts3Words = null;
var counter = 0;
var scrollTimer;
var domListenerTimer;
var thisTab;

var delayInteractions = 800;
var numVisibleWords = 0;

clearDom();

chrome.runtime.sendMessage({message: "get data"}, function (response) {
    console.log('domready message from contentjs');
    // removeFindedWords();
    if (response) {
        ts3Words = response.ts3Words;
        thisTab = response.tab;
        console.log('response in content from bg');
        if ($(controlPanelId).length) $(controlPanelId).remove();

        if (response.ts3Words.active) {
            // $(tmpl).appendTo('body');
            $.get(chrome.extension.getURL('../content.html'), function (data) {

                $(data).appendTo('body');
                infoUpdate(response);
                removeFindedWords();


                if (response.ts3Words.learned.length) {
                    for (var i = 0; i < response.ts3Words.learned.length; i++) {
                        searchWord(response.ts3Words.learned[i]);
                        markLearned(response.ts3Words.learned[i].id);
                    }
                }
                if (ts3Words.counter < ts3Words.maxCounter) {
                    searchWord(ts3Words.words[ts3Words.currentWordIndex]);
                }


                if (thisTab.active) {
                    wordsInteractions();
                }

            });

        }

    }
});


// update info on activate tab

chrome.runtime.onMessage.addListener(function (response, sender, sendResponse) {
    ts3Words = response.ts3Words;
    if (response.ts3Words.active) {
        infoUpdate(response);
        if (response.message === "tab activated") {
            if (response.ts3Words.learned.length) {
                for (var i = 0; i < response.ts3Words.learned.length; i++) {
                    searchWord(response.ts3Words.learned[i]);
                    markLearned(response.ts3Words.learned[i].id);
                }
            }
            if (ts3Words.counter < ts3Words.maxCounter) {
                searchWord(ts3Words.words[ts3Words.currentWordIndex]);
            }
            $(controlPanelId).find('.__ts3w-allMatches').html($('.__ts3w-word').length);
            wordsInteractions();
            console.log('tab act callback');
        }
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
            };
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
    $('.__ts3w-control-panel__figure').off('click.ts3wSettings').on('click.ts3wSettings', function (e) {
        checkVisibility($('.__ts3w-word'));
        return false;
    });



}

function updatePanelInfo(data) {
    if (data) {
        $(controlPanelId).addClass('__ts3w-control-panel--processing');
        $(controlPanelId).find('.__ts3w-control-panel__header-title--collapsed').html(data.word + ' - ' + data.translation + ' (' + data.transliteration + ')');
        $(controlPanelId).find('.__ts3w-control-panel__definition-current').html(data.word);
        $(controlPanelId).find('.__ts3w-control-panel__definition-translate').html(data.translation);
        $(controlPanelId).find('.__ts3w-control-panel__definition-translit').html('(' + data.transliteration + ')');
        $(controlPanelId).find('.__ts3w-control-panel__figure-image').attr('src', data.imageurl).attr('alt', data.word);
        var examples = "";
        for (var i = 0; i < data.examples.length; i++) {
            examples += '<ts3w class="__ts3w-control-panel__example">' + data.examples[i] + '</ts3w>';
        }
        $(controlPanelId).find('.__ts3w-control-panel__examples').html(examples);
        $(controlPanelId).removeClass('__ts3w-control-panel--processing');
        $(controlPanelId).find('.__ts3w-interactions').html(data.renderCount);
        $(controlPanelId).find('.__ts3w-click').html(data.actionCount);
    }
    else {
        $(controlPanelId).addClass('__ts3w-control-panel--processing __ts3w-control-panel--collapsed');
        $(controlPanelId).find('.__ts3w-control-panel__header-title--collapsed').html("that's it for today");
        $(controlPanelId).find('.__ts3w-control-panel__definition-current').html("that's it for today");
        $(controlPanelId).find('.__ts3w-control-panel__definition-translate').html('');
        $(controlPanelId).find('.__ts3w-control-panel__definition-translit').html('');
        $(controlPanelId).find('.__ts3w-control-panel__figure-image').attr('src', 'https://bytesizemoments.com/wp-content/uploads/2014/04/placeholder.png').attr('alt', "that's it for today");
        $(controlPanelId).find('.__ts3w-control-panel__examples').html('');
        $(controlPanelId).removeClass('__ts3w-control-panel--processing');
        $(controlPanelId).find('.__ts3w-interactions').html('-');
        $(controlPanelId).find('.__ts3w-click').html('--');
    }

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
        filter: ['ts3w', 'aside', 'iframe', 'a', 'nav', 'footer', 'input', 'textarea'],
        accuracy: "exactly",
        diacritics: true,
        debug: true,
        each: function (el) {

            $(el).attr('data-word-id', word.id);
            console.log('finded word  - ', $(el));
            addWordsMarkup($(el), word);
            // console.time('overflowing');
            // $(el).overflowing('body', function(overflowed) {
            //     console.log($(el), 'This word is being overflowed', overflowed);
            // })
            // console.timeEnd('overflowing');
            // checkVisibility($(el));
            // attentionWord();

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
    $('body').mark(word.word, options);
}

function removeFindedWords() {
    $('.__ts3w-word__lng--current').each(function () {
        var text = $(this).text();
        $(this).parent().html(text);
    });
    var options = {
        element: "ts3w",
        className: "__ts3w-word"
    };
    $('body').unmark(options);
}

function checkVisibility(words) {
    // TODO: check if word owerflowed
    // parentContainter.offsetHeight < parentContainter.scrollHeight || parentContainter.offsetWidth < parentContainter.scrollWidth
    // or parent.scrollWidth > $(parent).innerWidth() ..
    // need step by step check all parents for all words???? o_O how about perfomance???
    var words = words || $('.__ts3w-word').not('.__ts3w-word--learned');
    for (var i = 0; i < words.length; i++) {
        var $word = $(words[i]);
        if ($word.visible() && $word.is(':visible') && $word.css('visibility') != 'hidden' && $word.css('opacity') != 0) {
            $word.addClass('__ts3w-word--visible');

        }
        else {
            // $word.removeClass('__ts3w-word--visible');
        }
    }
    numVisibleWords = $('.__ts3w-word--visible').not('.__ts3w-word--learned').length;
    $(controlPanelId).find('.__ts3w-visibleMatches').html(numVisibleWords);
}


/**
 *
 * @param $el {jQuery object}
 * @param translations {object}
 */
function addWordsMarkup($el, word) {
    var markup = '';
    counter++;
    var filter = svgFilter;
    var currWord = $el.text();
    filter = filter.replace('<filter>', '<filter id="__ts3w-word-filter_' + counter + '">');
    $el.attr('data-id', '__ts3w-word-filter_' + counter);
    markup += '<ts3w class="__ts3w-word__lng __ts3w-word__lng--current" style="filter: url(\'#__ts3w-word-filter_' + counter + '\'); -webkit-filter: url(\'#__ts3w-word-filter_' + counter + '\');" title="' + word.word + ' - ' + word.translation + ' (' + word.transliteration + ')">' + currWord + '</ts3w>';
    markup += '<ts3w class="__ts3w-word__lng __ts3w-word__lng--translit">' + word.transliteration + '</ts3w>';
    markup += '<ts3w class="__ts3w-word__lng __ts3w-word__lng--translate">' + word.translation + '</ts3w>';
    markup += '<ts3w class="__ts3w-word__lng __ts3w-word__lng--rotator">' + currWord + '|' + word.translation + '|' + word.transliteration + '</ts3w>';
    markup += filter;
    // markup += '<ts3w class="__ts3w-word__lng __ts3w-word__lng--all">' + word.word + ' - ' + word.translation + ' (' + word.transliteration +  ')</ts3w>';

    $el.html(markup);

    // console.log($el, 'marked');

}

function clearDom() {
    $(controlPanelId).remove();
    $('.__ts3w-markup').remove();
    $(document).off('scroll.ts3w');
    $(document).off('click.ts3wSettings');
}


function attentionWord() {
    var $words = $('.__ts3w-word--visible').not('.__ts3w-word--attention').not('.__ts3w-word--learned');
    var action = false;
    if ($words.length) {
        action = true;
        ts3Words.words[ts3Words.currentWordIndex].renderCount++;
        chrome.runtime.sendMessage({message: "word interaction", ts3Words: ts3Words}, function (response) {
            if (ts3Words.currentWordIndex != response.ts3Words.currentWordIndex) {
                numVisibleWords = 0;
                markLearned(ts3Words.words[ts3Words.currentWordIndex].id);
                searchWord(ts3Words.words[response.ts3Words.currentWordIndex]);
                ts3Words.learned[ts3Words.currentWordIndex] = ts3Words.words[ts3Words.currentWordIndex];
                response.ts3Words.learned[ts3Words.currentWordIndex] = ts3Words.words[ts3Words.currentWordIndex];
                wordsInteractions();
            }
            infoUpdate(response);
        });
    }
    $words.each(function () {
        var $word = $(this);
        $word.addClass('__ts3w-word--attention');
        var turbVal = {val: 0.000001};
        var turb = $word.find('feTurbulence');
        var btTl = new TimelineLite({
            paused: true,
            onUpdate: function () {
                turb[0].setAttribute('baseFrequency', '0.00001 ' + turbVal.val);
            },
            onComplete: function () {
                showLngVariants($word);
            }
        });

        btTl.to(turbVal, 0.2, {val: 0.08});
        btTl.to(turbVal, 0.2, {val: 0.000001});

        setTimeout(function () {
            btTl.restart();
        }, 300);
    });


    $(document).off('click.ts3wSettings').on('click.ts3wSettings', '.__ts3w-word--attention', function (e) {
        e.preventDefault();
        e.stopPropagation();

        if (+$(this).attr('data-word-id') != ts3Words.currentWordIndex) {
            updatePanelInfo(ts3Words.learned[+$(this).attr('data-word-id')]);
            $(controlPanelId).addClass('__ts3w-control-panel--focus').removeClass('__ts3w-control-panel--collapsed  __ts3w-control-panel--settings');
            $(controlPanelId).animateCss('pulse');
        }
        else {
            ts3Words.words[ts3Words.currentWordIndex].renderCount = 0;
            ts3Words.words[ts3Words.currentWordIndex].actionCount++;
            $(controlPanelId).addClass('__ts3w-control-panel--focus').removeClass('__ts3w-control-panel--collapsed  __ts3w-control-panel--settings');
            $(controlPanelId).animateCss('pulse');

            chrome.runtime.sendMessage({message: "word interaction", ts3Words: ts3Words}, function (response) {
                if (ts3Words.currentWordIndex != response.ts3Words.currentWordIndex) {
                    numVisibleWords = 0;
                    markLearned(ts3Words.words[ts3Words.currentWordIndex].id);
                    searchWord(ts3Words.words[response.ts3Words.currentWordIndex]);
                    ts3Words.learned[ts3Words.currentWordIndex] = ts3Words.words[ts3Words.currentWordIndex];
                    response.ts3Words.learned[ts3Words.currentWordIndex] = ts3Words.words[ts3Words.currentWordIndex];
                    wordsInteractions();
                }
                infoUpdate(response);
            });
        }

        return false;
    });
    $(document).off('click.ts3w').on('click.ts3w', function (e) {
        console.log($(e.target).parents('ts3w').length);
        console.log(e.target.tagName.toLowerCase());
        if (!$(e.target).parents('ts3w').length && e.target.tagName.toLowerCase() != 'ts3w') {
            $(controlPanelId).removeClass('__ts3w-control-panel--focus');
            if (ts3Words.counter < ts3Words.maxCounter) {
                updatePanelInfo(ts3Words.words[ts3Words.currentWordIndex]);
            }
            else {
                updatePanelInfo();
            }
        }
    });
    return action;
}

function wordsInteractions() {
    if (scrollTimer) clearTimeout(scrollTimer);

    scrollTimer = setTimeout(function () {

        checkVisibility();
        if (attentionWord()) {
            // $(controlPanelId).animateCss('rubberBand');
        }


    }, delayInteractions);

}

function infoUpdate(response) {
    ts3Words = response.ts3Words;
    if (JSON.parse(localStorage.getItem('ts3w'))) {
        ts3Words.panel = JSON.parse(localStorage.getItem('ts3w')).panel;
    }
    localStorage.setItem('ts3w', JSON.stringify(ts3Words));
    $(controlPanelId).css({
        top: ts3Words.panel.position.top,
        left: ts3Words.panel.position.left,
        bottom: ts3Words.panel.position.bottom,
        right: ts3Words.panel.position.right
    }).addClass('__ts3w-control-panel--' + ts3Words.panel.state);

    addPanelAppereance($(controlPanelId));
    if (ts3Words.counter < ts3Words.maxCounter) {
        updatePanelInfo(ts3Words.words[ts3Words.currentWordIndex]);
    }
    else {
        updatePanelInfo();
    }



   
}

function showLngVariants($words) {
    $words.each(function () {
        var $word = $(this);
        var currLng = $word.find('.__ts3w-word__lng--current');
        var translitLng = $word.find('.__ts3w-word__lng--translit');
        var translateLng = $word.find('.__ts3w-word__lng--translate');
        var rotator = $word.find('.__ts3w-word__lng--rotator');
        var rotatorCounter = 0;
        currLng.hide();
        rotator.Morphext({
            // The [in] animation type. Refer to Animate.css for a list of available animations.
            animation: "bounceIn",
            // An array of phrases to rotate are created based on this separator. Change it if you wish to separate the phrases differently (e.g. So Simple | Very Doge | Much Wow | Such Cool).
            separator: "|",
            // The delay between the changing of each phrase in milliseconds.
            speed: 2000,
            complete: function () {
                rotatorCounter++;
            }
        });
        rotator.show();

    });
}

function markLearned(wordId) {
    $('.__ts3w-word[data-word-id="' + wordId + '"]').addClass('__ts3w-word--learned __ts3w-word--visible __ts3w-word--attention');
}


$(document).off('scroll.ts3w').on('scroll.ts3w', function () {

    wordsInteractions();
});

document.addEventListener("DOMSubtreeModified", function (e) {
    if (e.target.tagName && e.target.tagName.toLowerCase() != 'ts3w') {
        if (domListenerTimer) clearTimeout(domListenerTimer);

        domListenerTimer = setTimeout(function () {
            if (ts3Words.learned.length) {
                for (var i = 0; i < ts3Words.learned.length; i++) {
                    searchWord(ts3Words.learned[i]);
                    markLearned(ts3Words.learned[i].id);
                }
            }
            if (ts3Words.counter < ts3Words.maxCounter) {
                searchWord(ts3Words.words[ts3Words.currentWordIndex]);
            }
            $(controlPanelId).find('.__ts3w-allMatches').html($('.__ts3w-word').length);
            wordsInteractions();

        }, 1500);
    }

});