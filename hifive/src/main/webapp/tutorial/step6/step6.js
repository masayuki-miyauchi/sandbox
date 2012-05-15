$(function() {
	// ロジックのコンストラクタを定義
	function CalcLogic() {
	//
	}

	// メソッドを定義
	CalcLogic.prototype = {
		__name: 'CalcLogic',

		add: function(left, right) {
			return left + right;
		}
	};
	// コントローラの元となるオブジェクトを作成
	var controller = {

		__name: 'CalcController',

		// ロジックの宣言
		calcLogic: new CalcLogic(),

		'#calc click': function() {
			// 左辺の値を取得
			var left = $('#left').val();
			// 値がなければ処理を終了
			if (!left) {
				return;
			}
			// StringからNumberへ変換。変換に失敗したら終了
			try {
				left = parseInt(left);
			} catch (e) {
				return;
			}
			// 右辺の値を取得
			var right = $('#right').val();
			// 値がなければ処理を終了
			if (!right) {
				return;
			}
			// StringからNumberへ変換。変換に失敗したら終了
			try {
				right = parseInt(right);
			} catch (e) {
				return;
			}

			// CalcLogicのaddメソッドを呼び出す
			var ret = this.calcLogic.add(left, right);

			// 結果を画面に出力
			this.$find('#result').html(ret);
		}
	};

	// id="container"である要素にコントローラをバインド
	h5.core.controller('#container', controller);
});