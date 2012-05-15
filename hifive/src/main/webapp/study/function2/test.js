(function() {

	var add = function(a, b) {
		return a + b;
	};

	// 外に定義した関数を使用
	var test1 = function() {
		add(1, 1);
	};

	// 内部で関数を定義する
	var test2 = function() {
		var add = function(a, b) {
			return a + b;
		};

		add(1, 1);
	};

	var count = 1000000;

	function calculate(func, msg) {
		var start = new Date();
		for ( var i = 0; i < count; i++) {
			func();
		}
		var end = new Date();
		console.log(msg + (end - start) + 'ms');
	}

	calculate(test1, '外で定義した関数を使用: ');
	calculate(test2, '内部で関数を定義: ');

})();