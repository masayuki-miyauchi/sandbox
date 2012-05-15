$(function() {

	// コントローラの作成とバインド
	var controllerBaseObj = {
		// ロジック
		sampleLogic: new SampleLogic(),

		'input[name=name] change': function() {
			this.checkUserName(this.context.targetElement);
		},

		'input[name=email] change': function(promise, resolve, reject) {
			var target = this.context.targetElement;
			var ret = this.checkEmail(target);
			if (ret) {
				var self = this;
				ret.done(function() {
					self.context.errMsg ? self.invalid(target, self.context.errMsg) : self
							.valid(target);
					resolve();
				});
				return promise();
			}
		},

		'input[name=password] change': function() {
			this.checkPassword(this.context.targetElement);
		},

		checkUserName: function(target) {
			var userName = $(target).val();
			var errMsg = this.sampleLogic.checkUserName(userName);
			if (errMsg) {
				this.invalid(target, errMsg);
			} else {
				this.valid(target);
			}
		},

		checkEmail: function(target) {
			var email = $(target).val();
			var ret = this.sampleLogic.checkEmail(email);
			var isPromise = h5.u.isPromise(ret);
			if (ret && !isPromise) {
				this.invalid(target, ret);
			} else if (isPromise) {
				return ret;
			} else {
				this.valid(target);
			}
		},

		checkPassword: function(target) {
			var password = $(target).val();
			var errMsg = this.sampleLogic.checkPassword(password);
			if (errMsg) {
				this.invalid(target, errMsg);
			} else {
				this.valid(target);
			}
		},

		invalid: function(element, message) {
			var target = $(element);
			target.css('background-color', '#FFB6C1');
			target.next('span.error').html(message);
		},

		valid: function(element) {
			var target = $(element);
			target.css('background-color', '#FFFFFF');
			target.next('span.error').empty();
		},

		'form[name=sampleForm] submit': function(promise, resolve, reject) {
			this.context.event.preventDefault();

			var userName = this.find('input[name=name]');
			var email = this.find('input[name=email]');
			var password = this.find('input[name=password]');

			this.checkUserName(userName);
			this.checkPassword(password);
			var ret = this.checkEmail(email);
			if (ret) {
				var context = this.context;
				ret.done(function() {
					if (!context.errMsg) {
						alert('登録可能です。');
					}
					resolve();
				});
				return promise();
			}
		}
	};

	h5.core.controller('#test', 'TestController', controllerBaseObj);
});