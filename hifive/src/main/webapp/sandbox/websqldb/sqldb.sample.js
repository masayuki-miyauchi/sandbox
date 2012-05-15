$(function() {
	db = null;
	NO_SUPPORT = 'no support';
	async = h5.async;

	function dump(msg) {
		$('#ul').append('<li>' + msg + '</li>');
	}
	function formatSQLError(err) {
		return h5.u.str.format('エラー：{0}\n{1}', err.detail, err.message);
	}

	// 日付のフォーマット(引数なしなら現在時刻)
	function dateFormat(dateStr) {
		var di = dateStr ? new Date(dateStr) : new Date();
		var y = di.getFullYear();
		var m = di.getMonth() + 1;
		var d = di.getDate();
		if (m < 10) {
			m = "0" + m;
		}
		if (d < 10) {
			d = "0" + d;
		}
		return [y, m, d].join('/');
	}

	// ロジックのコンストラクタを定義
	function SampleSqldbLogic() {
	// コンストラクタ
	}

	// メソッドを定義
	SampleSqldbLogic.prototype = {
		__name: 'SampleSqldbLogic',

		// データベースの初期化処理
		init: function() {
			var dfd = async.deferred();
			db = h5.api.sqldb.open('hcdb', '1', 'hcdb', 2 * 1024 * 1024);

			// テーブルの作成
			var selectTableListPromise = db.select('sqlite_master', '*').where({
				'type =': 'table'
			}).execute();
			selectTableListPromise
					.done(function(rs) {
						var existAccountTable = false;
						var existProductTable = false;
						for ( var i = 0, len = rs.length; i < len; i++) {
							if (rs.item(i).name === 'ACCOUNT') {
								existAccountTable = true;
								continue;
							} else if (rs.item(i).name === 'PRODUCT') {
								existProductTable = true;
							}
						}
						var createTransaction = db.transaction();
						if (!existProductTable) {
							db
									.sql(
											'CREATE TABLE PRODUCT ( item CHAR(20) NOT NULL , price INTEGER NOT NULL, CONSTRAINT PK_PRODUCT PRIMARY KEY (item));',
											[]).execute().fail(function(err) {
										dfd.reject(err);
									}).progress(function(a) {
										console.log(a);
										dfd.notify('データベースにテーブル"PRODUCT"を新規作成しました。');
									});
						} else {
							this.notify('データベースにテーブル"PRODUCT"が存在します。');
						}
						if (!existAccountTable) {
							db
									.sql(
											'CREATE TABLE ACCOUNT ('
													+ 'key INTEGER NOT NULL CONSTRAINT PK_ACCOUNT PRIMARY KEY AUTOINCREMENT'
													+ ', item CHAR(20) NOT NULL'
													+ ', num INTEGER NOT NULL'
													+ ', date CHAR(10) NOT NULL'
													+ ', CONSTRAINT FK_ACCOUNT_1 FOREIGN KEY (item)'
													+ '             REFERENCES PRODUCT (item));',
											[]).execute().fail(function(err) {
										dfd.reject(err);
									}).done(function() {
										dfd.notify('データベースにテーブル"ACCOUNT"を新規作成しました。');
									});
						} else {
							this.notify('データベースにテーブル"ACCOUNT"が存在します。');
						}
						var createPromise = createTransaction.execute();
						createPromise.fail(function(err) {
							dfd.reject(err);
						}).done(function() {
							dfd.resolve();
						});
					});

			return dfd.promise();
		},

		drop: function() {
			var dfd = async.deferred();
			db.sql('DROP TABLE ACCOUNT', []).execute().progress(function(rs, tx) {
				dfd.notify('ACCOUNTテーブルを削除しました。');
				db.sql('DROP TABLE PRODUCT', [], tx).execute().progress(function(rs, tx) {
					dfd.notify('PRODUCTテーブルを削除しました。');
				})
			}).done(function() {
				dump('トランザクション成功：テーブルは２つとも削除されました。');
			}).fail(function(err) {
				dump('トランザクション失敗：テーブルは２つとも削除されていません。');
			});
			return dfd.promise();
		},

		// PRODUCTテーブルに品物があるか
		isExistProduct: function(item) {
			dump(h5.u.str.format('PRODUCTテーブルに品物"{0}"があるかどうかチェックします。', item));
			var dfd = async.deferred();
			db.select('PRODUCT', ['item']).where({
				'item =': item
			}).execute().done(function(rs) {
				if (rs.length >= 1) {
					dfd.resolve(true);
				} else {
					dfd.resolve(false);
				}
			}).fail(function(err) {
				dfd.reject(err);
			});
			return dfd.promise();
		},

		// ACCOUNTテーブルに品物があるか
		isExistInAccount: function(item) {
			dump(h5.u.str.format('ACCOUNTテーブルに品物"{0}"があるかどうかチェックします。', item));
			var dfd = async.deferred();
			db.select('ACCOUNT', ['item']).where({
				'item =': item
			}).execute().done(function(rs) {
				if (rs.length >= 1) {
					dfd.resolve(true);
				} else {
					dfd.resolve(false);
				}
			}).fail(function(err) {
				dfd.reject(err);
			});
			return dfd.promise();
		},

		insertProduct: function(item, price) {
			dump(h5.u.str.format('PRODUCTテーブルに{item: "{0}", price: "{1}"}を登録します。', item, price));
			var dfd = async.deferred();
			db.insert('PRODUCT', {
				item: item,
				price: price
			}).execute().done(function() {
				dump('登録しました。');
				dfd.resolve();
			}).fail(function() {
				dfd.reject();
			});
			return dfd.promise();
		},

		insertAccount: function(data) {
			dump(h5.u.str.format('ACCOUNTテーブルに{date: "{0}", item: "{1}", num: {2}}を登録します。',
					data.date, data.item, data.num));
			var dfd = async.deferred();
			// 日付の整形
			data.date = dateFormat(data.date);
			db.insert('ACCOUNT', data).execute().done(function() {
				dump('登録しました。');
				dfd.resolve();
			}).fail(function(err) {
				dfd.reject(err);
			});
			return dfd.promise();
		},

		updateAccount: function(data) {
			dump(h5.u.str.format(
					'ACCOUNTテーブルのkey="{0}"のカラムを{date: "{1}", item: "{2}", num: {3}}に更新します。',
					data.key, data.date, data.item, data.num));
			var dfd = async.deferred();
			// 日付の整形
			data.date = dateFormat(data.date);
			db.update('ACCOUNT', data).where({
				'key =': data.key
			}).execute().done(function() {
				dump('更新しました。');
				dfd.resolve();
			}).fail(function(err) {
				dfd.reject(err);
			});
			return dfd.promise();
		},

		selectProduct: function() {
			dump('PRODUCTテーブルからデータを取得します。');
			var dfd = async.deferred();
			db.select('PRODUCT', '*').orderBy('item').execute().done(function(rs) {
				dump('取得しました');
				var resultArray = [];
				for ( var i = 0, len = rs.length; i < len; i++) {
					console.log(rs.item(i)['price']);
					resultArray.push({
						item: rs.item(i)['item'],
						price: rs.item(i)['price'],
					});
				}
				dfd.resolve(resultArray);
			}).fail(function(err) {
				dfd.reject(err);
			});
			return dfd.promise();
		},

		selectAccount: function() {
			dump('ACCOUNTテーブルからデータを取得します。');
			var dfd = async.deferred();
			db
					.sql(
							'SELECT date, ACCOUNT.item, num, (num * price) as total, key FROM ACCOUNT LEFT OUTER JOIN PRODUCT ON ACCOUNT.item = PRODUCT.item ORDER BY date DESC',
							[]).execute().done(function(rs) {
						dump('取得しました');
						var resultArray = [];
						for ( var i = 0, len = rs.rows.length; i < len; i++) {
							resultArray.push({
								date: rs.rows.item(i)['date'],
								item: rs.rows.item(i)['item'],
								num: rs.rows.item(i)['num'],
								total: rs.rows.item(i)['total'],
								key: rs.rows.item(i)['key']
							});
						}
						dfd.resolve(resultArray);
					}).fail(function(err) {
						dfd.reject(err);
					});
			return dfd.promise();
		},

		delProduct: function(item) {
			dump(h5.u.str.format('PRODUCTテーブルのitem="{0}"のカラムを削除します。', item));
			var dfd = async.deferred();
			db.del('PRODUCT').where({
				'item =': item
			}).execute().fail(function(err) {
				dfd.reject(err);
			}).done(function() {
				dump('削除しました');
				dfd.resolve();
			});
			return dfd.promise();
		},

		delAccount: function(key) {
			dump(h5.u.str.format('ACCOUNTテーブルのkey="{0}"のカラムを削除します。', key));
			var dfd = async.deferred();
			db.del('ACCOUNT').where({
				'key =': key
			}).execute().fail(function(err) {
				dfd.reject(err);
			}).done(function() {
				dump('削除しました');
				dfd.resolve();
			});
			return dfd.promise();
		}
	};

	var sampleSampleSqldbController = {
		__name: 'SampleSqldbController',

		logic: new SampleSqldbLogic(),

		__templates: 'table.ejs',

		__init: function(context) {
			if (!h5.api.sqldb.isSupported) {
				alert('お使いのブラウザはWEB SQL Databaseをサポートしていません。');
				return;
			}
			var promise = this.logic.init();
			var that = this;
			promise.progress(function(msg) {
				dump(msg);
			}).fail(function(err) {
				alert(formatSQLError(err));
			}).done(function() {
				that.updateProduct();
				that.updateResult();
			});
		},

		__ready: function(context) {
			// デフォルトで今日の日付を購入日に入力
			this.$find('#account_date').val(dateFormat());
		},

		// フォームのクリア
		'#product_clear click': function(context) {
			$('#product_item').val('');
			$('#product_price').val('');
		},

		// フォームのクリア
		'#account_clear click': function(context) {
			$('#account_date').val('');
			$('#account_item').val('');
			$('#account_num').val('');
		},

		// DB上のテーブルをdropする。テスト用。
		'#drop click': function(context) {
			this.logic.drop().progress(function(msg) {
				dump(msg);
			});
		},

		// 商品を登録
		'#product_regist click': function(context) {
			var item = $('#product_item').val();
			var price = parseInt($('#product_price').val());
			if (!item || !$('#product_price').val()) {
				alert('品物名と単価を入力してください');
				return;
			}
			if (isNaN(price) || price <= 0 || price != parseFloat($('#product_price').val())) {
				alert('単価には正の整数を入力してください');
				return;
			}
			var that = this;
			this.logic.insertProduct(item, parseInt(price)).done(function(aa) {
				alert(h5.u.str.format('品物を登録しました。\n品物名:{0}\n単価：{1}円', item, price));
				that.updateProduct();
			}).fail(function(err) {
				console.log(err);
				alert('既に登録されています。');
			});
		},

		// 買ったものを登録
		'#account_regist click': function(context) {
			var checkedObj = this.checkInputAccount($('#account_date').val(), $('#account_item')
					.val(), $('#account_num').val());
			if (!checkedObj) {
				return;
			}
			// 品物名がPRODUCTテーブルに存在するかチェック
			var that = this;
			this.logic.isExistProduct(checkedObj.item).done(function(exist) {
				if (exist) {
					// 購入情報を登録する
					that.logic.insertAccount(checkedObj).done(function() {
						alert('買ったものを登録しました。');
						that.updateResult('resultTable');
					}).fail(function(err) {
						alert('登録に失敗しました。');
						that.log.debug(err);
					});
				} else {
					alert('品物が登録されていません。先に品物を登録してください。');
				}
			}).fail(function(err) {
				alert(err);
			});
		},

		// 買い物を削除
		'.delResult click': function(context) {
			var $td = $(context.event.target).parent();
			var key = $td.find('input').val();
			var $tr = $td.parent();
			var date = $tr.find('.date').text();
			var item = $tr.find('.item').text();
			var num = $tr.find('.num').text();
			if (!confirm(h5.u.str
					.format('この買い物を削除します。\n購入日：{0}\n品物：{1}\n個数：{2}\n', date, item, num))) {
				return;
			}
			var that = this;
			this.logic.delAccount(key).done(function() {
				alert('削除しました。');
				that.updateResult();
			}).fail(function(err) {
				alert('削除に失敗しました。');
			});
		},

		// 商品を削除
		'.delProduct click': function(context) {
			var tr = $(context.event.target).parent().parent();
			var item = tr.find('.item').text();
			var price = tr.find('.price').text();
			if (!confirm(h5.u.str.format('この商品を削除します。\n品物名：{0}\n単価：{1}\n', item, price))) {
				return;
			}
			var that = this;
			this.logic.isExistInAccount(item).done(function(exist) {
				if (exist) {
					alert('購入してある商品は削除できません。');
					return;
				}
				that.logic.delProduct(item).done(function() {
					alert('削除しました。');
					that.updateProduct();
				}).fail(function(msg) {
					alert(msg);
				});
			}).fail(function(msg) {
				alert(msg);
			});
		},

		// 品物名を買い物登録フォームに入力
		'.inputThis click': function(context) {
			$('#account_item').val($(context.event.target).parent().parent().find('.item').text());
		},

		// 買い物履歴の編集
		'.editResult click': function(context) {
			var $tr = $(context.event.target).parent().parent();
			$tr.find('.tgl').toggle();
			$tr.parent().find('button:not(.edit)').attr("disabled", "disabled");
			var dateResult = $tr.find('.date').text();
			var itemResult = $tr.find('.item').text();
			var numResult = $tr.find('.num').text();
			$tr.find('.dateInput').val(dateResult);
			$tr.find('.itemInput').val(itemResult);
			$tr.find('.numInput').val(numResult);
		},

		// 編集を適用する
		'.submitEdit click': function(context) {
			var $td = $(context.event.target).parent();
			var key = $td.find('input').val();
			var $tr = $td.parent();
			var dateResult = $tr.find('.date').text();
			var itemResult = $tr.find('.item').text();
			var numResult = $tr.find('.num').text();
			var dateInput = $tr.find('.dateInput').val();
			var itemInput = $tr.find('.itemInput').val();
			var numInput = $tr.find('.numInput').val();

			// 入力チェック
			var checkedObj = this.checkInputAccount(dateInput, itemInput, numInput);
			if (!checkedObj) {
				return;
			}

			// 更新内容があるかどうかチェック
			if (dateResult === dateInput && itemResult === itemInput && numResult === numInput) {
				alert('更新内容がありません。');
				return;
			}

			// ACCOUNTテーブルの主キーとなるキーを登録
			checkedObj.key = key;

			// 品物名がPRODUCTテーブルに存在するかチェック
			var that = this;
			this.logic.isExistProduct(checkedObj.item).done(function(exist) {
				if (exist) {
					// 購入情報を更新
					that.logic.updateAccount(checkedObj).done(function() {
						alert('更新しました。');
						that.updateResult('resultTable');
					}).fail(function(err) {
						alert('更新に失敗しました。');
						that.log.debug(err);
					});
				} else {
					alert('品物が登録されていません。先に品物を登録してください。');
				}
			}).fail(function(err) {
				alert(err);
			});
		},

		// 編集のキャンセル
		'.cancelEdit click': function(context) {
			var tr = $(context.event.target).parent().parent();
			tr.find('.tgl').toggle();
			tr.parent().find('button').removeAttr("disabled");
		},

		// 買い物履歴への登録時の入力チェックを行い、オブジェクトに格納して返す
		checkInputAccount: function(date, item, num) {
			// 入力チェック
			if (!date || date == 'yyyy/mm/dd' || !item || !num) {
				alert('購入日、品物名、買った数を入力してください');
				return false;
			}
			// 日付チェック
			if (!(function(dateStr) {
				var ymd = dateStr.split('/');
				var y = ymd[0];
				var m = ymd[1];
				var d = ymd[2];
				var di = new Date(y, m - 1, d);
				return (di.getFullYear() == y && di.getMonth() == m - 1 && di.getDate() == d);
			})(date)) {
				alert('購入日は{yyyy/mm/dd}形式で正しい日付を入力してください。');
				return false;
			}

			if (num <= 0 || parseInt(num) != parseFloat(num)) {
				alert('買った数には正の数を入力してください');
				return false;
			}
			return {
				date: date,
				item: item,
				num: num
			};
		},

		// 買い物履歴テーブルを更新する
		updateResult: function() {
			var $table = this.$find('#resultTable');
			if ($table.length === 0) {
				return;
			}
			var that = this;
			this.logic.selectAccount().done(function(data) {
				that.view.update($table.find('tbody'), 'resultTable', {
					result: data
				});
			}).fail(function(err) {
				console.log(err);
			});
		},

		// 品物テーブルを更新する
		updateProduct: function() {
			var $table = this.$find('#productTable');
			if ($table.length === 0) {
				return;
			}
			var that = this;
			this.logic.selectProduct().done(function(data) {
				that.view.update($table.find('tbody'), 'productTable', {
					result: data
				});
			}).fail(function(err) {
				console.log(formatSQLError(err));
			});
		}
	};

	var mainController = {
		__name: 'mainController',

		__ready: function(context) {
			this['{window} resize'](context);
		},

		'{window} resize': function(context) {
			this.rootElement.style.height = window.innerHeight - 220 + 'px';
			if (parseInt(this.$find('.wrap').css('min-width')) > window.innerWidth) {
				$('#main').css('overflow-x', 'scroll');
			} else {
				$('#main').css('overflow-x', 'hidden');
			}
		}
	};

	h5.core.controller('#main', mainController);
	h5.core.controller('body', sampleSampleSqldbController);
});
