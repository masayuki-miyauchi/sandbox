// ロジッククラスの定義
function SampleLogic() {
// constructor
}

SampleLogic.prototype = {


	checkUserName: function(userName) {
		if (!this._required(userName)) {
			return '名前は必須項目です。';
		}
		if (!this._length(userName, 6, 12)) {
			return '名前は6文字以上12文字以下で入力してください。';
		}
		if (!this._ascii(userName)) {
			return '名前は半角英数字で入力してください。';
		}
		return;
	},

	checkEmail: function(email, promise, resolve, reject) {
		if (!this._required(email)) {
			return 'メールアドレスは必須項目です。';
		}
		if (!this._email(email)) {
			return 'メールアドレスの形式が違います。';
		}
		return this._uniqueEmail(email);
	},

	checkPassword: function(password) {
		if (!this._required(password)) {
			return 'パスワードは必須項目です。';
		}
		if (!this._length(password, 6, 12)) {
			return 'パスワードは6文字以上12文字以下で入力してください。';
		}
		return;
	},

	_required: function(str) {
		return str && str.length > 0;
	},

	_length: function(str, min, max) {
		return str && (min <= str.length && str.length <= max);
	},

	_email: function(str) {
		return str && str.match(/^[\w\-]+\.?[\w\-]+@([\w\-]+\.)+[\w\-]+$/);
	},

	_ascii: function(str) {
		for ( var i = 0; i < str.length; i++) {
			if (str.charCodeAt(i) < 0x20 || str.charCodeAt(i) > 0x7e) {
				return false;
			}
		}
		return true;
	},

	_uniqueEmail: function(email, promise, resolve) {
		var context = this.context;
		setTimeout(function() {
			if (email === 'test@ns-sol.co.jp') {
				context.errMsg = 'そのメールアドレスは既に使われています。';
			}
			resolve();
		}, 200);
		return promise();
	}
};