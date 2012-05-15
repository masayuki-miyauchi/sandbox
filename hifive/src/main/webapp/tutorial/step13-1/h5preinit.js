$(document).bind('h5preinit', function() {
	// Loggerのレベルの設定
	h5.settings.log = {
		defaultOut: {
			level: 'trace',
			targets: 'console'
		}
	};
	var aspect = {
		target: 'HelloWorldController',
		interceptors: h5.core.interceptor.lapInterceptor,
		pointCut: '#btn click'
	};

	h5.settings.aspects = aspect;
});