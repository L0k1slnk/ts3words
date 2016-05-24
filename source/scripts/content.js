$(function () {
   debugger
   $.get(chrome.extension.getURL('content.html'), function (data) {
      $(data).appendTo('body');
   });

});