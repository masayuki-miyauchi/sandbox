$(function() {

	/**
	 * プレイヤー遅延読み込み用のコントローラ
	 *
	 * @name ListController
	 * @namespace
	 */
	var listController = {
		/**
		 * コントローラ名
		 *
		 * @memberOf ListController
		 */
		__name: 'ListController',

		/**
		 * スクロール停止と判断するまでの間隔。単位はms。
		 *
		 * @memberOf ListController
		 */
		delay: 500,

		/**
		 * タイマー登録用プロパティ
		 *
		 * @memberOf ListController
		 */
		timer: null,

		/**
		 * documentでscrollイベントが起こったときのハンドラ
		 *
		 * @param {Object} context コンテキスト
		 * @memberOf ListController
		 */
		'{document} [scroll]': function(context) {
			if (this.timer) {
				clearTimeout(this.timer);
			}
			this.timer = setTimeout(this.own(this.addPlayer), this.delay);
		},

		/**
		 * 可視範囲内のプレイヤー表示用コンテナにプレイヤーを埋め込みます。
		 */
		addPlayer: function() {
			var $players = $('div.videoFrame:not(div.videoLoaded)');
			if (!$players.length) {
				return;
			}

			var that = this;
			// 可視範囲内のそれぞれのプレイヤーコンテナでプレイヤーを読み込む
			$players.each(function() {
				var videoFrame = this;
				if (h5.ui.isInView(videoFrame)) {
					var $target = $(videoFrame);
					var $videoSrc = $target.find('input.videoSrc');
					if (!$videoSrc.length) {
						return;
					}
					that.view.update(videoFrame, 'player', {
						player: $videoSrc.val()
					});
					$target.addClass('videoLoaded');
				}
			});
		}
	};

	/**
	 * コントローラオブジェクト
	 *
	 * @name YoutubeController
	 * @namespace
	 */
	var youtubeController = {

		/**
		 * コントローラ名
		 *
		 * @memberOf YoutubeController
		 */
		__name: 'YoutubeController',
		/**
		 * 使用するテンプレート
		 *
		 * @memberOf YoutubeController
		 */
		__templates: 'list.ejs',

		/**
		 * 子コントローラ(ListController)の宣言
		 *
		 * @memberOf YoutubeController
		 */
		listController: listController,

		/**
		 * 子コントローラのメタ情報を定義
		 *
		 * @memberOf YoutubeController
		 */
		__meta: {
			listController: {
				useHandlers: true
			}
		},

		/**
		 * VideoLogicを宣言
		 *
		 * @memberOf YoutubeController
		 */
		videoLogic: new VideoLogic(),

		/**
		 * 1度に読み込む件数
		 *
		 * @memberOf YoutubeController
		 */
		maxResults: 6,

		/**
		 * スクロールバーの最下部からどの位置にきたら次を読み込むか
		 *
		 * @memberOf YoutubeController
		 */
		scrollRemain: 50,

		/**
		 * 検索キーワード
		 *
		 * @memberOf YoutubeController
		 */
		keyword: '',

		/**
		 * 現在読み込んでいるインデックス
		 *
		 * @memberOf YoutubeController
		 */
		index: 0,

		/**
		 * キーワードにヒットする総件数
		 *
		 * @memberOf YoutubeController
		 */
		totalCount: 0,

		/**
		 * 検索したかどうか
		 *
		 * @memberOf YoutubeController
		 */
		searched: false,

		/**
		 * 初期化処理
		 *
		 * @param {Object} context コンテキスト
		 * @memberOf YoutubeController
		 */
		__ready: function(context) {
			this.$find('input[type=submit]').button();
		},

		/**
		 * id="search"のフォームでsubmitイベントが起こったときのハンドラ
		 *
		 * @param {Object} context コンテキスト
		 * @memberOf YoutubeController
		 */
		'#search submit': function(context) {
			$('#searchCount').html(0);
			$('#videos').empty();
			context.event.preventDefault();

			var keyword = this.$find('#keyword').val();
			if (!keyword || $.trim(keyword).length === 0) {
				return;
			}

			this.keyword = keyword;
			this.index = 1 + this.maxResults;
			var promise = this.videoLogic.search(keyword, 1, this.maxResults);

			var that = this;
			this.$find('#keyword').blur();

			promise.done(function(data) {
				that.totalCount = data.feed.openSearch$totalResults.$t;
				that.$find('#searchCount').html(that.totalCount);
				that.view.update('#videos', 'list', {
					entry: data.feed.entry
				});
				// 初期表示時に可視範囲に入っているプレイヤーを埋め込むためにイベントをトリガ
				that.trigger('scroll');
				if (that.totalCount > that.maxResults) {
					that.view.append('#videos', 'empty_list');
				}
				that.searched = true;
			});

			var indicator = this.indicator({
				target: window,
				message: '検索中…',
				promises: promise
			}).show({
				throbber: {
					size: 60
				}
			});
		},

		/**
		 * documentでscrollイベントが起こったときのハンドラ
		 *
		 * @param {Object} context コンテキスト
		 * @memberOf YoutubeController
		 */
		'{document} [scroll]': function(context) {
			if (!this.searched) {
				return;
			}

			var target = context.event.target;
			var scrollTop = $(target).scrollTop();
			var scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
			var clientHeight = window.innerHeight;
			var remain = scrollHeight - (scrollTop + clientHeight);
			if (remain > this.scrollRemain) {
				return;
			}

			var keyword = this.keyword;
			var index = this.index;
			this.index = index + this.maxResults;
			var promise = this.videoLogic.search(keyword, index, this.maxResults);

			var that = this;

			promise.done(function(data) {
				that.$find('#searchCount').html(data.feed.openSearch$totalResults.$t);
				that.view.append('#videos', 'list', {
					entry: data.feed.entry
				});
				var $emptyList = that.$find('#emptyList');
				if (that.totalCount === that.$find('li.list').length - 1) {
					$emptyList.remove();
				} else {
					that.$find('#videos').append($emptyList);
				}
			});

			var indicator = this.indicator({
				target: '#emptyList',
				block: false,
				promises: promise
			}).show({
				showRound: false,
				throbber: {
					size: 48
				}
			});
		}
	};

	h5.core.controller('#container', youtubeController);
});