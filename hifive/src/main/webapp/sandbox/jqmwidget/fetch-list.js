(function() {
	/**
	 * DataLogicクラスのコンストラクタ
	 *
	 * @class
	 * @name DataLogic
	 */
	function DataLogic() {
	//
	}

	DataLogic.prototype = {
		/**
		 * ロジック名
		 *
		 * @memberOf DataLogic
		 */
		__name: 'DataLogic',

		/**
		 * 指定された条件でサーバにリクエストを送信する。
		 *
		 * @memberOf DataLogic
		 * @param {String} url サーバURL
		 * @param {Object} data サーバに送信するパラメータ
		 * @returns jqXHRオブジェクト
		 */
		search: function(url, data) {
			return $.ajax({
				dataType: 'jsonp',
				url: url,
				data: data,
				cache: true
			});
		}
	};

	/**
	 * コントローラオブジェクト
	 *
	 * @name fetchListController
	 * @namespace
	 */
	var H5FetchListController = {
		/**
		 * コントローラ名
		 *
		 * @memberOf fetchListController
		 */
		__name: 'H5FetchListController',
		/**
		 * 使用するテンプレート
		 *
		 * @memberOf fetchListController
		 */
		__templates: 'template.ejs',

		/**
		 * DataLogicを宣言
		 *
		 * @memberOf fetchListController
		 */
		dataLogic: new DataLogic(),

		/**
		 * スクロールバーの最下部からどの位置にきたら次を読み込むか
		 *
		 * @memberOf fetchListController
		 */
		scrollRemain: 50,

		/**
		 * 検索中かを判定するフラグ
		 */
		searched: false,

		/**
		 * リクエスト送信中を判定するフラグ
		 */
		isLoading: false,

		/**
		 * __readyイベント
		 *
		 * @memberOf fetchListController
		 */
		__ready: function() {
			var $form = this.$find('form').first();
			this.url = $form.attr('action');
			$form.jqmData('ajax', false);
			// $form.removeAttr('action');
		},

		ejsViewHelper: {
			setFetchCondition: function(name, value) {
				var $form = $(':jqmData(role="h5fetchlist") form').first();
				$form.find('input[name=' + name + ']').jqmData(name, value);
			},
			getFetchCondition: function(name) {
				var $form = $(':jqmData(role="h5fetchlist") form').first();
				return $form.find('input[name=' + name + ']').jqmData(name);
			}
		},

		/**
		 * 検索ボタン押下アクション
		 *
		 * @param {Object} context コンテキスト
		 * @memberOf fetchListController
		 */
		'form submit': function(context) {
			var $form = this.$find('form').first();
			var parameter = $form.serializeArray();

			for ( var i = 0; i < parameter.length; i++) {
				if ($.trim(parameter[i].value).length === 0) {
					context.event.preventDefault();
					return;
				}
			}

			$form.find(':input').blur();

			var listview = this.$find(':jqmData(role="listview"').first();

			listview.empty();

			var indicator = this.indicator({
				target: window,
				message: '検索中…'
			}).show({
				throbber: {
					size: 30
				}
			});

			var that = this;

			this.dataLogic.search(this.url, parameter).done(function(data) {
				indicator.hide();

				$form.find(':input').each(function() {
					var $e = $(this);
					var elementName = $e.attr('name');

					if (!elementName) {
						return true;
					}
					$e.jqmData(elementName, $e.val());
				});

				var listview = that.$find(':jqmData(role="listview")').first();

				that.view.update(listview, 'fetchlistResult', {
					response: data,
					setFetchCondition: that.ejsViewHelper.setFetchCondition,
					getFetchCondition: that.ejsViewHelper.getFetchCondition
				});

				listview.append('<li class="h5-fetchlist-empty-li"></li>');
				listview.listview('refresh');
				that.searched = true;
			});

			context.event.preventDefault();
			return;
		},

		/**
		 * 画面最下部にスクロールされると、サーバからリストアイテムを取得します。
		 *
		 * @param {Object} context コンテキスト
		 * @memberOf fetchListController
		 */
		'{window} [scroll]': function(context) {
			if (this.searched === false || this.isLoading === true) {
				return;
			}

			var scrollTop = $(context.event.target).scrollTop();
			var scrollHeight = $(document).height();
			var clientHeight = window.innerHeight;
			var remain = scrollHeight - (scrollTop + clientHeight);

			if (remain > this.scrollRemain) {
				return;
			}

			this.isLoading = true;

			var $form = this.$find('form').first();
			var parameter = [];

			$form.find(':input').each(function() {
				var $e = $(this);
				var elementName = $e.attr('name');

				if (!elementName) {
					return true;
				}

				var obj = {};
				obj.name = elementName;
				obj.value = $e.jqmData(elementName);
				parameter.push(obj);
			});

			var listview = this.$find(':jqmData(role="listview")').first();
			var emptyLi = listview.children('.h5-fetchlist-empty-li');
			var indicator = this.indicator({
				target: emptyLi,
				block: false
			}).show({
				showRound: true,
				throbber: {
					color: 'white',
					size: 45
				}
			}).message('読み込み中...');

			var that = this;

			setTimeout(function() {
				that.dataLogic.search(that.url, parameter).done(function(data) {
					indicator.hide();

					that.view.append(listview, 'fetchlistResult', {
						response: data,
						setFetchCondition: that.ejsViewHelper.setFetchCondition,
						getFetchCondition: that.ejsViewHelper.getFetchCondition
					});

					if (emptyLi.nextAll().length > 0) {
						listview.children(':last').after(emptyLi);
						listview.listview('refresh');
					} else {
						emptyLi.remove();
					}

					that.isLoading = false;
				});
			}, 800);
		}
	};

	$.widget("mobile.h5fetchlist", $.mobile.widget, {
		options: {
			initSelector: ":jqmData(role='h5fetchlist')"
		},
		_create: function() {
			this.refresh();
		},

		refresh: function() {
			h5.core.controller(this.element, H5FetchListController);
		},

		_getObjectByNS: function(ns) {
			if ($.type(ns) !== 'string') {
				return;
			}

			var objs = ns.split('.');
			var ret = window;
			for ( var i = 0; i < objs.length; i++) {
				ret = ret[objs[i]];
			}

			return ret;
		}
	});


	$(document).bind("pagecreate create", function(e) {
		$($.mobile.h5fetchlist.prototype.options.initSelector, e.target).h5fetchlist();
	});
})();