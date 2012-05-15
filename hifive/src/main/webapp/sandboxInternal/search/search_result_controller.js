$(function() {

	// スクロールイベント後に指定された間隔だけ時間があくと処理を実行するコントローラ
	var delayScr = {

		__name: 'DelayScrollController',

		// スクロール停止と判断するまでの間隔。単位はms。
		delay: 500,

		'{document} [scroll]': function(context) {
			this.delayHandler(context);
		},

		delayHandler: function() {
			if (this.__clearDelayScrollStatus__) {
				clearTimeout(this.__clearDelayScrollStatus__);
			}
			// thisを退避
			var that = this;
			var args = arguments;
			this.__clearDelayScrollStatus__ = setTimeout(function() {
				that.delayFunc.apply(that, args);
			}, this.delay);
		},

		delayFunc: function() {
		// 独自処理
		}
	};

	// delayScrをカスタマイズした独自コントローラ
	// 参照を変えるためにオブジェクトを作成
	var myDelayScr = $.extend({}, delayScr);
	// 拡張用メソッドを上書きして独自処理を追加
	myDelayScr.delayFunc = function(data) {
		var that = this;
		var list = $('#result').children('li');

		// 可視範囲内のそれぞれのリストで画像を読み込む
		list.each(function() {
			var li = this;
			if (h5.u.visibleRange(li)) {
				var target = $(li);
				var imgContainer = target.find('div.img_container');
				var img = imgContainer.find('img');
				if (img.length)
					return;

				that.busyIndicator({
					target: imgContainer.get(0),
					size: 48
				});

				var imgName = imgContainer.find('input[name=imgName]').val();
				var imageUrl = that.getImageUrl(data, imgName);
				var imgTag = that.getView('image', {
					src: imageUrl
				});
				setTimeout(function() {
					imgContainer.html(imgTag).load(function() {
						$(this).addClass('imgloaded');
						that.hideBusyIndicator({
							target: imgContainer.get(0)
						});
					});
				}, 400);
			}
		});
	};

	var getImageUrl = function(data, name) {
		for ( var i = 0, len = data.length; i < len; i++) {
			if (name === data[i].name)
				return data[i].imageUrl;
		}
	};
	myDelayScr.getImageUrl = getImageUrl;


	// 一番下までスクロールされた時に処理を実行するコントローラ
	var delayList = {

		__name: 'DelayListController',

		'{document} [scroll]': function(context) {
			return this.delayListHandler(context);
		},

		delayListHandler: function(context) {
			// イベントコンテキストに格納されたイベントがトリガされた要素
			var target = context.event.target;
			var scrollTop = $(target).scrollTop();
			var scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
			var clientHeight = window.innerHeight;
			var remain = scrollHeight - (scrollTop + clientHeight);
			if (remain <= 20) {
				return this.delayListFunc.apply(this, arguments);
			}
		},

		delayListFunc: function() {
		// 独自処理
		}
	};

	// delayListをカスタマイズした独自コントローラ
	var myDelayList = $.extend({}, delayList);
	myDelayList.delayListFunc = function(context, params) {
		var currentIndex = params.currentIndex;
		var readingCount = params.readingCount;
		var totalCount = params.totalCount;
		var endIndex = null;
		if (totalCount > (currentIndex + readingCount)) {
			endIndex = currentIndex + readingCount;
		} else {
			endIndex = totalCount;
		}
		params.endIndex = endIndex;

		// 初期データの取得
		return this.getList(params);
	};

	// 独自コントローラで使用するロジックを設定
	myDelayList.sLogic = new SearchLogic();
	// 独自コントローラで使用するプライベートメソッドを設定
	myDelayList.getList = function(params) {

		var startIndex = params.currentIndex;
		var endIndex = params.endIndex;
		var parameter = params.searchCondition;

		// インジケータを表示
		this.busyIndicator({
			target: '#result',
			size: 48,
			position: 'bottom'
		});

		// ロジックを取得
		var searchLogic = this.sLogic;

		// searchLogic#getListメソッドを実行
		var ret = searchLogic.search(startIndex, endIndex, parameter);

		// thisの退避
		var that = this;

		var defer = $.Deferred();

		// searchLogic#getListの戻り値であるpromiseがresolveした時の処理
		ret.done(function(data) {
			// イベントコンテキストに格納されたロジックの処理結果を取得
			var totalData = params.totalData;

			// テンプレートにロジックの処理結果を渡し、HTML文字列を取得
			var list = that.getView('list', {
				data: data
			});
			list = $(list);
			// 画面を更新
			$('#result').append(list);

			// インジケータを消す
			that.hideBusyIndicator({
				target: '#result'
			});

			// 処理の終了
			defer.resolve(endIndex, totalData.concat(data));
		});
		return defer.promise();
	};

	// コントローラの作成とバインド
	var controller = {

		__name: 'SearchResultController',

		// 使用するテンプレート
		__templates: ['list.ejs', 'image.ejs'],

		// デリゲート先コントローラの設定
		myDelayScrController: myDelayScr,
		myDelayListController: myDelayList,

		// ロジック
		searchLogic: new SearchLogic(),

		// 1度に表示する件数
		readingCount: 5,

		// 検索条件
		searchCondition: {},

		// 総件数
		totalCount: 0,

		// 現在のインデックス
		currentIndex: 0,

		totalData: null,

		'{#searchCondition} search': function(context) {
			var searchCondition = context.evArg;
			this.searchCondition = searchCondition;
			this.blockParent();
			var that = this;
			var dfd = this.deferred();
			var ret1 = this.searchLogic.getTotalCount(searchCondition);
			ret1.done(function(totalCount) {
				that.totalCount = totalCount;
				that.currentIndex = that.readingCount;
				var endIndex = totalCount > that.readingCount ? that.readingCount : totalCount;
				var ret2 = that.searchLogic.search(0, endIndex, searchCondition);

				ret2.done(function(data) {
					that.currentIndex = endIndex;
					that.totalData = data;
					var list = that.getView('list', {
						data: data
					});
					if (list) {
						list = $(list);
						$('#searchCount').html(totalCount);
						$('#result').html(list);

						that.unblockParent();

						// 可視範囲内のそれぞれのリストで画像を読み込む
						list.filter('li').each(function() {
							var li = this;
							if (h5.u.visibleRange(li)) {
								var target = $(li);
								var imgContainer = target.find('div.img_container');
								that.busyIndicator({
									target: imgContainer.get(0),
									size: 48
								});

								var imgName = imgContainer.find('input[name=imgName]').val();
								var imageUrl = that.getImageUrl(data, imgName);
								var imgTag = that.getView('image', {
									src: imageUrl
								});
								imgContainer.html(imgTag).load(function() {
									$(this).addClass('imgloaded');
									that.hideBusyIndicator({
										target: imgContainer.get(0)
									});
								});
							}
						});
					}
					dfd.resolve();
				});
			});
			return dfd.promise();
		},

		getImageUrl: getImageUrl,

		'{document} [scroll]': function(context) {
			var that = this;
			var dfd = this.deferred();
			var promise = this.delayListFunc(context);
			if (promise) {
				promise.done(function(currentIndex, totalData) {
					that.currentIndex = currentIndex;
					that.totalData = totalData;
					that.myDelayScrController.delayHandler(totalData);
					dfd.resolve();
				});
				return dfd.promise();
			}
			this.myDelayScrController.delayHandler(this.totalData);
		},

		delayListFunc: function(context) {
			var params = {
				currentIndex: this.currentIndex,
				readingCount: this.readingCount,
				totalCount: this.totalCount,
				searchCondition: this.searchCondition,
				totalData: this.totalData
			};
			return this.myDelayListController.delayListHandler(context, params);
		}
	};

	h5.core.controller('#searchResult', controller);
});