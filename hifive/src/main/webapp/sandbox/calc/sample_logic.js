// ロジックのアスペクトを定義
var logicAspects = [{
	interceptor: function(invocation) {
		dump('&nbsp;&nbsp;&nbsp;&nbsp;start by aop for logic');

		var invokePromise = invocation.proceed();

		if (invokePromise && h5.u.isPromise(invokePromise)) {
			var dfd = h5.u.deferred();
			invokePromise.done(function() {
				dump('&nbsp;&nbsp;&nbsp;&nbsp;end by aop for logic');
				dfd.resolve.apply(dfd, arguments);
			});
			return dfd.promise();
		}
		dump('&nbsp;&nbsp;&nbsp;&nbsp;end by aop for logic');
		return;


	},
	pointCut: ['all']
}];

// ロジッククラスの定義
function SampleLogic() {
//
}

SampleLogic.prototype = {

	__name: 'SampleLogic',

	// testメソッドの定義.
	test: function(num) {
		dump('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;logic.test start!');

		var dfd = this.deferred();
		h5.async.order(this).next(this._privateMethod1, num).next(this._privateMethod2, num).next(
				this._privateMethod3, num).execute().done(function() {
			dump('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;logic.test end!');
			dfd.resolve.apply(dfd, arguments);
		}).fail(function() {
			dump('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;logic.test end!');
			dfd.resolve.apply(dfd, arguments);
		});
		return dfd.promise();
	},

	// _privateMethod1の定義
	_privateMethod1: function(num) {
		var dfd = this.deferred();
		setTimeout(function() {
			dump('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;async1 execute');
			dfd.resolve(num * 2);
		}, 1000);
		return dfd.promise();
	},

	// _privateMethod2の定義
	_privateMethod2: function(num) {
		dump('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;sync2 execute');
		return num * 5;
	},

	// _privateMethod3の定義
	_privateMethod3: function(num) {
		var dfd = this.deferred();
		setTimeout(function() {
			dump('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;async3 execute');
			dfd.resolve(num * 10);
		}, 500);
		return dfd.promise();
	}
};