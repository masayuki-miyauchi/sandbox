$(function() {

	SESSION = 'session';
	LOCAL = 'local';

	function SampleStorageLogic() {
	// コンストラクタ
	}

	SampleStorageLogic.prototype = {
		__name: 'SampleStorageLogic',

		clearSessionStorage: function() {
			h5.api.storage.session.clear();
		},

		clearLocalStorage: function() {
			h5.api.storage.local.clear();
		},

		add: function(storage, key, val) {
			var st = null;
			if (storage === LOCAL) {
				st = h5.api.storage.local;
			} else {
				st = h5.api.storage.session;
			}

			var savedval = st.getItem(key);
			st.setItem(key, val);

			if (savedval == undefined) {
				alert("ストレージに値を登録しました。");
			} else {
				alert("ストレージの値を更新しました。");
			}
		},
	};

	function SampleNoApiLogic() {
	// コンストラクタ
	}
	SampleNoApiLogic.prototype = {
		__name: 'SampleNoApiLogic',

		clearSessionStorage: function() {
			h5.api.storage.session.clear();
		},

		clearLocalStorage: function() {
			h5.api.storage.local.clear();
		},

		add: function(storage, key, val) {
			var st = null;
			if (storage === LOCAL) {
				st = localStorage;
			} else {
				st = sessionStorage;
			}

			var savedval = st.getItem(key);
			st.setItem(key, val);

			if (savedval == undefined) {
				alert("ストレージに値を登録しました。");
			} else {
				alert("ストレージの値を更新しました。");
			}
		},
	};

	var sampleStorageController = {
		__name: 'SampleStorageController',

		val: null,

		__ready: function(context) {
			this.viewStorage();
		},

		apiLogic: new SampleStorageLogic(),
		noApiLogic: new SampleNoApiLogic(),

		'#addInput click': function(context) {
			var val = document.getElementById("storageStrValue").value;
			if (!val) {
				alert('値を入力してください。');
				return;
			}
			this.addStorage(val, context);
		},

		'#addObject click': function(context) {
			this.addStorage({
				str: 'test',
				num: 10
			}, context);
		},

		'#addArray click': function(context) {
			this.addStorage([1, "two", 3], context);
		},

		'#addDate click': function(context) {
			this.addStorage(new Date(), context);
		},

		'#addRegExp click': function(context) {
			var val = document.getElementById("storageRegExpValue").value;
			if (!val) {
				alert('値を入力してください。');
				return;
			}
			this.addStorage(new RegExp(val), context);
		},

		addStorage: function(val, context) {
			var storage = this.$find("input[type='radio']:checked").val();
			var key = $(context.event.target).parent().find('.storageKey').val();
			if (!key) {
				alert('キーを入力してください。');
				return;
			}
			(this.useApi() ? this.apiLogic : this.noApiLogic).add(storage, key, val);
			this.viewStorage();
		},

		viewStorage: function() {
			var baseDiv = this.$find('#result table');
			baseDiv.find('tr').remove();

			var tr2 = $('<tr></tr>');
			tr2.append('<td>ストレージ</td>');
			tr2.append('<td>キー</td>');
			tr2.append('<td>値</td>');
			tr2.children('td').css('border-width', '2px').css('border-style', 'solid');
			tr2.appendTo(baseDiv);

			var that = this;
			if (this.useApi()) {
				h5.api.storage.local.each(function(i, k, v) {
					that.addResult(baseDiv, 'Local Storage', k, v);
				});

				h5.api.storage.session.each(function(i, k, v) {
					that.addResult(baseDiv, 'Session Storage', k, v);
				});
			} else {
				for ( var k in localStorage) {
					that.addResult(baseDiv, 'Local Storage', k, localStorage.getItem(k));
				}
				for ( var k in sessionStorage) {
					that.addResult(baseDiv, 'Session Storage', k, sessionStorage.getItem(k));
				}
			}
		},

		addResult: function(base, type, key, value) {
			var tr = $('<tr></tr>');
			tr.append('<td class="type">' + type + '</td>');
			tr.append('<td class="keyView">' + key + '</td>');
			tr.append('<td>' + value + '</td>');
			tr.append('<td><button class="c_getValue">値を取得</button></td>');
			tr.children('td').css('border-width', '1px').css('border-style', 'solid');
			tr.appendTo(base);
		},

		useApi: function() {
			return this.$find('*[name=checkApi]')[0].checked;
		},

		'#toggleResult click': function(context) {
			$('#result table').toggle();
			var button = context.event.target;
			button.value = button.value == "非表示" ? "表示" : "非表示";
		},

		'#reloadView click': function(context) {
			this.viewStorage();
		},

		'.c_getValue click': function(context) {
			var val = this.getValFromView(context);
			this.val = val;
			alert('値を取得しました。');
		},
		'.doAlert click': function(context) {
			alert(this.val);
		},
		'.doConsole click': function(context) {
			console.log(this.val);
		},
		'.doGetFullYear click': function(context) {
			alert(this.val.getFullYear());
		},
		'.doRegExp click': function(context) {
			alert('hello!!world!!'.match(this.val));
		},

		getValFromView: function(context) {
			var $tr = $(context.event.target).parent().parent();
			var key = $tr.find('.keyView').text();
			var storage = ($tr.find('.type').text() === 'Local Storage') ? LOCAL : SESSION;
			var st = this.useApi() ? ((storage == LOCAL) ? h5.api.storage.local
					: h5.api.storage.session)
					: ((storage == LOCAL) ? localStorage : sessionStorage);
			return st.getItem(key);
		},
		'#allDelete click': function(context) {
			if (!confirm('ストレージ内のデータをすべて削除します')) {
				return;
			}
			h5.api.storage.local.clear();
			h5.api.storage.session.clear();
			this.viewStorage();
		},

	};

	h5.core.controller('#app', sampleStorageController);
});