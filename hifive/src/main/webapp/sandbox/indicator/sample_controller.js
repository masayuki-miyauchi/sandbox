$(function() {

	var mainController = {
		__name: 'mainController',

		__ready: function(context) {
			this['{window} resize'](context);
		},

		'{window} resize': function(context) {
			this.rootElement.style.height = $(window).height() - 220 + 'px';
			if (parseInt(this.$find('.wrap').css('min-width')) > window.innerWidth) {
				$('#main').css('overflow-x', 'scroll');
			} else {
				$('#main').css('overflow-x', 'hidden');
			}
		}
	};

	// parent2のdiv
	var parentController = {

		__name: 'ParentController',

		option: {
			// ここの値によってブロックする範囲が変わる。
			receiveBlock: false
		},

		'#childrenBlock click': function() {
			// child1StartボタンのselfBlockイベント、child2Startボタンのclickイベントをトリガ.
			$('#child3Block').trigger('selfBlock');
			$('#child4Block').trigger('click');
		},


		'#globalBlock click': function(promise, resolve, reject) {
			dump('globalBlock start');

			var dfd = this.deferred();
			// BODYをブロックする
			var indicator = this.indicator({
				target: document.body,
				message: 'global block',
				promises: dfd.promise()

			}).show();

			// 非同期処理の中で使用するために退避

			// indicator()にpromiseオブジェクトを渡しているのでresolve()またはreject()されると自動的にindicator.hide()される
			setTimeout(function() {
				dump('globalBlock end');
				dfd.resolve();
			}, 4000);
			return dfd.promise();
		}
	};

	// child1のdiv
	var child1Controller = {

		__name: 'Child1Controller',

		'#child1Block click': function(context) {
			dump('child1 start');

			var indicator = this.indicator({
				message: 'child1 block'
			}).show();

			// 非同期処理の中で使用するために退避
			var dfd = this.deferred();

			setTimeout(function() {
				indicator.hide();
				dump('child1 end');
				dfd.resolve();
			}, 800);
			return dfd.promise();
		}
	};

	// child2のdiv
	var child2Controller = {

		__name: 'Child2Controller',

		'#parentBlock click': function(promise, resolve, reject) {
			dump('child2 start');
			var indicator = this.indicator({
				// targetに親コントローラを指定
				target: $(this.rootElement).parent(),
				message: 'child2 parent block'
			}).show();

			var dfd = this.deferred();

			setTimeout(function() {
				indicator.hide();
				dump('child2 end');
				dfd.resolve();
			}, 2500);
			return dfd.promise();
		}
	};

	// child3のdiv
	var child3Controller = {
		__name: 'Child3Controller',

		// トリガーで呼ばれるイベント
		'#child3Block selfBlock': function(context) {
			dump('child3 start');

			// 自身をブロックする
			var indicator = this.indicator({
				message: 'child1 self block'
			}).show();

			// 非同期処理の中で使用するために退避
			var dfd = this.deferred();

			setTimeout(function() {
				// 自身のブロックを解除
				indicator.hide();
				dump('child3 end');
				dfd.resolve();
			}, 800);
			return dfd.promise();
		}
	};

	// child4のdiv
	var child4Controller = {
		__name: 'Child4Controller',

		'#child4Block click': function(context) {
			dump('child4 start');

			// 自身をブロックする
			var indicator = this.indicator({
				message: 'child1 self block'
			}).show();

			// 非同期処理の中で使用するために退避
			var dfd = this.deferred();

			setTimeout(function() {
				// 自身のブロックを解除
				indicator.hide();
				dump('child4 end');
				dfd.resolve();
			}, 800);
			return dfd.promise();
		}
	};

	// child5のdiv
	var child5Controller = {
		__name: 'Child5Controller',

		'#globalBlock click': function(promise, resolve, reject) {
			dump('globalBlock start');

			var dfd = this.deferred();
			// BODYをブロックする
			var indicator = this.indicator({
				target: document.body,
				message: 'global block',
				promises: dfd.promise()

			}).show();

			// 非同期処理の中で使用するために退避

			// indicator()にpromiseオブジェクトを渡しているのでresolve()またはreject()されると自動的にindicator.hide()される
			setTimeout(function() {
				dump('globalBlock end');
				dfd.resolve();
			}, 2000);
			return dfd.promise();
		}
	};

	// child6のdiv
	var child6Controller = {

		__name: 'Child6Controller',

		'#child6Start click': function(context) {
			dump('child6 start');

			// プログレスバーの表示
			var indicator = this.indicator({}).show();

			// Deferredオブジェクトを作成
			var dfd = this.deferred();
			var i = 0;
			var id = setInterval(function() {
				// プログレスバーの非表示
				if (i >= 100) {
					indicator.hide();
					clearInterval(id);
					dump('child6 end');
					dfd.resolve();
					return;
				}
				indicator.percent(i++);
			}, 70);
			return dfd.promise();
		}
	};

	// child7のdiv
	var child7Controller = {

		__name: 'Child6Controller',


		'#child7Start click': function(context) {
			dump('child7 start');
			// Deferredオブジェクトを作成
			var dfd = this.deferred();
			var indicator = this.indicator({
				promises: dfd.promise()
			}).show();
			var i = 0;
			var mes = '';
			var id = setInterval(function() {
				indicator.percent(++i);

				// メッセージを表示
				if (i % 10 === 0) {
					indicator.message(mes += '■');
				}

				if (i >= 100) {
					clearInterval(id);
					dfd.resolve();
					dump('child7 end');
					return;
				}
			}, 30);

			return dfd.promise();
		}
	};

	// child8のdiv
	var child8Controller = {

		__name: 'Child8Controller',


		'#child8Start click': function(context) {
			dump('child8 start');
			var that = this;
			var func1 = function() {
				var df1 = that.deferred();

				setTimeout(function() {
					dump('child8 func1 end');
					df1.resolve();
				}, 4000);

				return df1.promise();
			};

			var func2 = function() {
				var df2 = that.deferred();
				setTimeout(function() {
					dump('child8 func2 end');
					df2.resolve();
				}, 6000);

				return df2.promise();
			};

			var indicator = this.indicator({
				promises: [func1(), func2()]
			}).show().message('処理中...');
		}
	};

	// コントローラの作成と要素へのバインド.
	h5.core.controller('#main', mainController);
	h5.core.controller('#parent2', parentController);
	h5.core.controller('#child1', child1Controller);
	h5.core.controller('#child2', child2Controller);
	h5.core.controller('#child3', child3Controller);
	h5.core.controller('#child4', child4Controller);
	h5.core.controller('#child5', child5Controller);
	h5.core.controller('#child6', child6Controller);
	h5.core.controller('#child7', child7Controller);
	h5.core.controller('#child8', child8Controller);
});