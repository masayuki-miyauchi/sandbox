$(document).bind('h5preinit', function() {
	var ic = h5.core.interceptor;

	var controllerAspects = [{
		interceptors: ic.logInterceptor
	}, {
		interceptors: ic.lapInterceptor
	}, {
		interceptors: ic.errorInterceptor
	}, {
		target: '*Controller',
		interceptors: function(invocation) {
			dump('start by aop for controller (#confirm click only)');

			var post = function() {
				dump('end by aop for controller (#confirm click only)');
			};

			var ret = invocation.proceed();
			if (ret && h5.u.isPromise(ret)) {
				var dfd = h5.u.deferred();
				ret.done(function() {
					post();
					dfd.resolve.apply(dfd, arguments);
				});
				return dfd.promise();
			}
			post();
			return ret;
		},
		pointCut: '#confirm click'
	}];

	// aspects

	h5.settings.aspects = controllerAspects;
});