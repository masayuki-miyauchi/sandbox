$(function() {
	function ItemSearchLogic() {}

	ItemSearchLogic.prototype = {
		__name: 'ItemSearchLogic',

		/**
		 * 商品リスト(商品名と税込価格)を取得する。
		 *
		 * @param categoryId {Number} カテゴリID
		 * @returns 商品リスト
		 */
		getItemList: function(categoryId) {
			var dfd = this.deferred();
			var result = null;

			this._getItemData(categoryId).done(function(data) {
				result = $.map(data, function(obj) {
					dfd.notify(data.length);
					obj.price = Math.floor(obj.price * 1.05);
					return obj;
				});
				dfd.resolve(result);
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
			var $resultDiv = this.$find('#resultList');
			var that = this;

			$resultDiv.empty();

			// 画面で選択されたカテゴリ
			var category = $('#select-category option:selected').val();

			this.itemSearchLogic.getItemList(category).done(function(resultData) {
				that.view.append($resultDiv, 'template1', {
					listData: resultData
				});
			}).fail(function(errMsg) {
				alert('取得に失敗しました' + errMsg);
			});
		}
	};

	h5.core.controller('#container', itemSearchController);
});
