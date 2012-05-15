$(function() {

	// ロジックのコンストラクタ
	function TubeLogic() {}

	/* 検索ボタンがクリックされた場合 */
	TubeLogic.prototype.searchMovie = function(address) {
		return $.ajax({
			dataType: 'jsonp',// jsonpでデータを取得
			data: {
				'vq': address,// 検索用クエリ
				'max-results': 5,// 表示件数は5件まで
				'alt': 'json-in-script',// alt属性への代替テキスト
			// 'start-index': startIndex
			},
			cache: true,
			url: 'http://gdata.youtube.com/feeds/base/videos'
		});

	};
	h5.u.exposeObject('Tube', {
		TubeLogic: TubeLogic
	});
});
