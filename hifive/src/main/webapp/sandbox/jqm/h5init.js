$(document).bind('h5preinit', function() {
	var is = [{
		interceptors: function(invocation) {
			$('#message').append('<div>interceptor1 executed.</div>');
			invocation.proceed();
		},
		pointCut: ['{window} [resize]']
	}, {
		interceptors: function(invocation) {
			$('#message').html("");
			invocation.proceed();
		}
	}];
	h5.settings.aspects = is;
});