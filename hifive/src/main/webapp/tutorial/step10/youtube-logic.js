/**
 * VideoLogicクラスのコンストラクタ
 *
 * @class
 * @name VideoLogic
 */
function VideoLogic() {}

VideoLogic.prototype = {

	/**
	 * ロジック名
	 *
	 * @memberOf VideoLogic
	 */
	__name: 'VideoLogic',

	/**
	 * 指定された条件でyoutubeのフィードにリクエストを送る
	 *
	 * @memberOf VideoLogic
	 * @param {String} keyword キーワード
	 * @param {Number} startIndex 開始インデックス
	 * @param {Number} maxResults 何件取得するか
	 * @returns jqXHRオブジェクト
	 */
	search: function(keyword, startIndex, maxResults) {
		var promise = h5.ajax({
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
		return promise;
	}
};