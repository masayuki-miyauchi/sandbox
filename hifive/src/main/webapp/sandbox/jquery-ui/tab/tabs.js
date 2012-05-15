$(function() {

	var controller = {
		__name: 'TabsController',

		// 初期化処理
		__ready: function() {
			var that = this;

			// jQuery UI Tabsを設定
			$(this.rootElement).tabs({
				// タブが選択された時のコールバックを設定
				// ownメソッドでラップしてイベントコンテキストやロジックを使えるようにしている。
				select: that.own(that.selectTab)
			});
		},

		// タブが選択された時のコールバック
		selectTab: function(event, ui) {
			$(ui.panel).html('tab' + (ui.index + 1) + 'が選択されました。');
		}
	};

	// コントローラの作成と要素へのバインド.
	h5.core.controller('#tabs', controller);
});