$(function() {

	// コントローラのベースとなるオブジェクトを作成.
	var controllerBaseObj = {

		__name: 'TestController',

		// 使用するテンプレート
		__templates: 'calc.ejs',

		// ロジック
		sampleLogic: new SampleLogic(),

		// id="confirm" の要素がクリックされた時に呼び出されるコールバック.
		'#confirm click': function(context) {
			dump('&nbsp;&nbsp;event callback start');
			// コントローラ内のメソッド"test"を呼び出す.
			return this.test($('#num').val());
		},

		test: function(num) {

			// SampleLogic.test(); の戻り値promiseを受け取る
			var logicPromise = this.sampleLogic.test(num);

			// Deferredオブジェクトを作成
			var dfd = this.deferred();

			// ロジックの非同期処理が終わったらイベントコンテキストに格納された値を使って
			// 画面を更新する。
			logicPromise.done(function() {
				dump('&nbsp;&nbsp;event callback end');
				dfd.resolve();
			});
			// コントローラのアスペクトに対してpromiseを返しておく.
			return dfd.promise();
		},

		'#unbind click': function(context) {
			this.unbind();
		}
	};

	h5.core.controller('#test', controllerBaseObj);
});