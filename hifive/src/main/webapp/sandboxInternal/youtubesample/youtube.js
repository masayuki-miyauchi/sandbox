$(function() {

	h5.core.view.load(['list.ejs']);

	function VideoLogic() {}
	VideoLogic.prototype.search = function(keyword, startIndex, maxResults) {
		return $.ajax({
			dataType: 'jsonp',
			data: {
				'vq': keyword,
				'max-results': maxResults,
				'alt': 'json-in-script',
				'start-index': startIndex
			},
			cache: true,
			url: 'http://gdata.youtube.com/feeds/api/videos'
		});
	};

	var controller = {
		videoLogic: new VideoLogic(),
		maxResults: 6,

		init: function() {
			this.find('input[type=submit]').button();
		},

		'#search submit': function() {
			$('#searchCount').html(0);
			$('#videos').empty();
			this.context.event.preventDefault();

			var keyword = $('#keyword').val();
			if (!keyword || $.trim(keyword).length == 0) {
				return;
			}

			this.blockParent();
			this.controllerContext.keyword = keyword;
			this.controllerContext.index = 1 + this.maxResults;

			var jqXhr = this.videoLogic.search(keyword, 1, this.maxResults);

			$('#keyword').blur();

			var that = this;

			jqXhr.done(function(data) {
				that.unblockParent();
				that.controllerContext.totalCount = data.feed.openSearch$totalResults.$t;

				$('#searchCount').html(that.controllerContext.totalCount);
				var entry = data.feed.entry;
				var list = that.view('list', {
					entry: entry
				});

				$('#videos').html(list);
				if (that.controllerContext.totalCount > that.maxResults) {
					$('#videos').append(that.view('empty_list'));
				}
				that.controllerContext.searched = true;
			});
		}
	};

	h5.core.controller('#container', controller);
});