$(function() {

	module("YoutubeLogic");

	asyncTest('VideoLogic#searchは動作するか', function() {
		var videoLogic = new VideoLogic();

		var jqXhr = videoLogic.search('cat', 1, 10);
		jqXhr.done(function(data) {
			start();
			ok(data.feed.openSearch$totalResults.$t > 0, '動画情報は取得できたか');
		});

	});
});
