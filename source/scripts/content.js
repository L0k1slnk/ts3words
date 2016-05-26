var controlPanelId = '#__ts3w-control-panel';

$(function () {
   chrome.runtime.sendMessage({message: "domready"}, function (response) {
      if (response) {
         if (!$(controlPanelId).length) {
            $.get(chrome.extension.getURL('../content.html'), function (data) {
               $(data).appendTo('body');
               var $controlPanel = $(controlPanelId);
               $controlPanel.text(response.counter);
            });
         }
         else {
            var $controlPanel = $(controlPanelId);
            $controlPanel.text(response.counter);
         }

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