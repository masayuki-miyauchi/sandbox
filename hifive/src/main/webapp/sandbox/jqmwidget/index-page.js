$(document).bind("pagebeforechange", function(ev, data) {
	if ( typeof data.toPage === "string" ) {
		var urlObj = $.mobile.path.parseUrl(data.toPage);
		var params = urlObj.hash.replace(/.+\?/, "").split("&");
	    var pageId = '#player-page';

		if (params.length === 2) {
			var $page = $(pageId);
			var $header = $page.find(':jqmData(role=header) > h1');
            var $content = $page.children(':jqmData(role=content)');
            var $iframe = $('<iframe></iframe>');
            $header.text(decodeURIComponent(params[1].replace(/title=/, "")));
            $iframe.width('100%');
            $iframe.height($('body').height() - 50);
            $iframe.attr('frameborder', 0);
            $iframe.appendTo($content);
            $iframe.attr('src', 'http://www.youtube.com/embed/'+ params[0].replace(/videoId=/, ""));

			$.mobile.changePage($page);
		}
	}
});
