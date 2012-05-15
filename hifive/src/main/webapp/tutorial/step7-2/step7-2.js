$(function() {
	function ItemSearchLogic() {}

	ItemSearchLogic.prototype = {
		/**
		 * ロジック名
		 */
		__name: 'ItemSearchLogic',

		/**
		 * 商品リスト(商品名と税込価格)を取得する。
		 *
		 * @param categoryId {Number} カテゴリID
		 * @returns 商品リスト
		 */
		getItemList: function(categoryId) {
			var dfd = this.deferred();
			var result = [];

			var that = this;
			this._getItemData(categoryId).done(function(data) {
				// notify/progress による画面更新を反映させるため処理を非同期にしている
				$.map(data, function(obj) {
					var func = function(resultObj) {
						var d = that.deferred();
						setTimeout(function() {
							obj.price = Math.floor(obj.price * 1.05);
							result.push(obj);
							dfd.notify(result.length);
							if(result.length === data.length){
								d.resolve();
							}
						}, 50);
						return d.promise();
					};
					func().done(function(){
						dfd.resolve(result);
					});
					return obj;
				});
			}).fail(function(error) {
				dfd.reject(error.message);
			});

			return dfd.promise();
		},

		/**
		 * カテゴリIDから商品(商品名と税抜価格)リストをサーバから取得する。
		 *
		 * @param categoryId {Number} カテゴリID
		 * @returns 商品リスト
		 */
		_getItemData: function(categoryId) {
			return $.ajax({ // [ {"itemname":"hoge", "price": "1000"}, ...] のようなJSONオブジェクトを返す
				type: 'GET',
				dataType: 'json',
				url: './itemList' + categoryId
			});
		}
	};

	var itemSearchController = {
		/**
		 * コントローラ名
		 */
		__name: 'ItemSearchController',
		/**
		 * テンプレート
		 */
		__templates: 'template.ejs',
		/**
		 * 商品検索ロジック
		 */
		itemSearchLogic: new ItemSearchLogic(),
		/**
		 * 検索ボタン押下アクション
		 */
		'#searchBtn click': function(context) {
			var indicator = this.indicator({
				message: '検索中…',
				target: document
			}).show();

			var category = $('#select-category option:selected').val();
			var $resultDiv = this.$find('#resultList');
			var that = this;
			var count = 0;

			$resultDiv.empty();

			// 画面で選択されたカテゴリ
			this.itemSearchLogic.getItemList(category).done(function(resultData) {
				that.view.append($resultDiv, 'template1', {
					listData: resultData
				});
				indicator.hide();
			}).fail(function(errMsg) {
				alert('取得に失敗しました' + errMsg);
				indicator.hide();
			}).progress(function(total) {
				indicator.message('検索中… ' + ++count + '/' + total);
			});
		}
	};

	h5.core.controller('#container', itemSearchController);
});
