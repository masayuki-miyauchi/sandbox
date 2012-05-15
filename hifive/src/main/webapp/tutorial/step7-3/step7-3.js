$(function() {

	/**
	 * 各ショップから商品情報を取得するロジック
	 */
	function ItemSearchLogic() {}

	ItemSearchLogic.prototype = {
		/**
		 * ロジック名
		 */
		__name: 'ItemSearchLogic',

		/**
		 * ショップのデータを取得するURL
		 *
		 * @type String
		 */
		shopListURL: './shopList',

		/**
		 * 商品リスト(商品名と税込価格)を取得する。
		 * ショップのリストをOrder.next()を使って取得し、取得された複数のショップに対してOrder.parallel()を使って並列に非同期でアクセスして商品を取得する。
		 * 最後に商品の最安値を計算し、結果に商品名、最安値、最安値で販売しているショップを格納する。
		 *
		 * @param categoryId {Number} カテゴリID
		 * @returns 商品リスト
		 */
		getItemList: function() {
			var dfd = this.deferred();
			var order = h5.async.order(this);

			order
					.next(function() {
						var d = this.deferred();
						var that = this;
						// notify/progress による画面更新を反映させるためsetTimout()で呼び出している
						setTimeout(function() {
							dfd.notify("ショップリストを取得しています...");
							setTimeout(function() {
								that._getData(that.shopListURL).done(function(result) {
									d.resolve(result);
								});
							}, 500);
						}, 500);
						// ショップのリストを取得
						return d.promise();
					})
					.next(function(resultObj) {
						dfd.notify("商品を取得しています...");

						var d = this.deferred();
						var that = this;
						setTimeout(function() {
							// 取得したショップのリストをresultObjに格納する
							var shopList = resultObj.data[0];

							// 取得したショップから商品を取得する関数の配列を生成する
							var param = [];
							for ( var i = 0; i < shopList.length; i++) {
								var url = shopList[i].url;
								var func = (function(_url) {
									return function() {
										return that._getData(_url);
									};
								})(url);
								param.push([func]);
							}

							// Orderオブジェクトをもう一つ作成し、複数のショップから商品を取得する処理を並列に実行する
							var subOrder = h5.async.order(this);
							subOrder.parallel(param).execute().done(function(result) {
								d.resolve(result);
							});
						}, 500);
						return d.promise();
					})
					.next(
							function(resultObj) {
								dfd.notify("最安値を計算しています...");
								setTimeout(
										function() {
											var resultMap = [];
											var shopList = resultObj.data[0];
											var itemLists = resultObj.data[1].data[0];

											// 各商品について、ショップ毎の価格を比較して、最安値のショップの値段とショップ名を格納する
											for ( var i = 0, len = itemLists.length; i < len; i++) {
												var items = itemLists[i][0];
												for ( var j = 0; j < items.length; j++) {
													var item = items[j];
													if (!resultMap[item.itemname]) {
														resultMap[item.itemname] = {
															price: item.price,
															shopname: shopList[i].name
														};
													} else {
														if (parseInt(resultMap[item.itemname].price) > parseInt(item.price)) {
															resultMap[item.itemname] = {
																price: item.price,
																shopname: shopList[i].name
															};
														}
													}
												}
											}

											// 結果を整形してresolve()で返す。
											var resultArray = [];
											for ( var itemname in resultMap) {
												resultArray.push($.extend(resultMap[itemname], {
													itemname: itemname
												}));
											}
											dfd.resolve({
												result: resultArray
											});
										}, 500);
							}).execute();
			return dfd.promise();
		},

		/**
		 * 指定されたURLのデータを取得する
		 *
		 * @param url {String} URL
		 * @returns {Object[]}
		 */
		_getData: function(url) {
			return $.ajax({
				type: 'GET',
				dataType: 'json',
				url: url + '?' + new Date(),
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
		'#getItem click': function(context) {
			var indicator = this.indicator({
				message: '取得中…',
				target: document
			}).show();

			var that = this;

			var $resultDiv = this.$find('#resultList');

			// 画面で選択されたカテゴリ
			this.itemSearchLogic.getItemList().done(function(resultData) {
				that.log.debug("データの取得が完了しました");
				var results = resultData.result;
				that.view.update($resultDiv, 'template1', {
					listData: results
				});
				indicator.hide();
			}).fail(function(errMsg) {
				alert('取得に失敗しました' + errMsg);
				indicator.hide();
			}).progress(function(message) {
				indicator.message(message);
				that.log.debug(message);
			});
		}
	};

	h5.core.controller('#container', itemSearchController);
});
