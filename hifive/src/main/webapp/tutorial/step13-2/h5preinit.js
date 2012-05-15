$(document).bind('h5preinit', function() {
	// Loggerのレベルの設定
	h5.settings.log = {
		defaultOut: {
			level: 'trace',
			targets: 'console'
		}
	};
	var aspect = {
		target: /^loop.*$/i,
		interceptors: function(invocation) {
			this.log.info(invocation.funcName + 'が開始されました。');
			invocation.proceed();
			this.log.info(invocation.funcName + 'が終了しました。');
		},
		pointCut: 'lo*'
	};

	h5.settings.aspects = aspect;
});