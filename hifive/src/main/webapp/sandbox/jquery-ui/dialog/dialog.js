$(function() {
	// ダイアログロジック
	function DialogLogic() {
	//
	}
	DialogLogic.prototype = {
		__name: 'DialogLogic',

		createUser: function() {
			this._private();
		},

		_private: function() {
			alert('create user!');
		}
	};

	var controller = {

		__name: 'DialogController',

		__templates: 'row.ejs',

		dialogLogic: new DialogLogic(),

		__ready: function() {
			// registerボタンの装飾
			$('#register').button();

			var that = this;

			// dialogの設定
			// ボタンを押した時のコールバックはhifive化したコントローラのメソッドを設定している。
			$('#dialog-form').dialog({
				autoOpen: false,
				height: 320,
				width: 350,
				modal: true,
				buttons: {
					'Create User': that.ownWithOrg(that.createUser),
					Cancel: that.ownWithOrg(that.cancel)
				},
				close: that.own(that.clearForm)
			});
		},

		'#register click': function() {
			$('#dialog-form').dialog('open');
		},

		// ダイアログの"Create User"ボタンがクリックされた時のコールバック
		// thisはコントローラ自身を指す。本来のthisはthis.context.thatに格納されている。
		createUser: function(originalThis, event) {
			// DialogLogicのcreateUserメソッドを呼ぶ
			this.dialogLogic.createUser();
			// 画面に追加する文字列を取得
			var row = this.view.get('row', {
				id: $('#id').val(),
				userName: $('#userName').val(),
				password: $('#password').val()
			});
			$('#result tbody').append(row);
			$(originalThis).dialog('close');
		},

		//
		cancel: function(target, event) {
			$(target).dialog('close');
		},

		// ダイアログ内のフォームをクリアする
		clearForm: function() {
			$('#id').val('');
			$('#userName').val('');
			$('#password').val('');
		}
	};

	// コントローラの作成と要素へのバインド.
	h5.core.controller('#container', controller);
});