(function() {

	var create = function() {
		return {
			str1: 'aaaa',
			num1: 101,
			func1: function() {
				console.log('log');
			},
			str2: 'aaaa',
			num2: 101,
			func2: function() {
				console.log('log');
			},
			str3: 'aaaa',
			num3: 101,
			func3: function() {
				console.log('log');
			},
			str4: 'aaaa',
			num4: 101,
			func4: function() {
				console.log('log');
			},
			str5: 'aaaa',
			num5: 101,
			func5: function() {
				console.log('log');
			},
			str6: 'aaaa',
			num6: 101,
			func6: function() {
				console.log('log');
			},
			str7: 'aaaa',
			num7: 101,
			func7: function() {
				console.log('log');
			}
		};
	};

	var count = 10000;

	function calculate(func, msg) {
		var start = new Date();
		for ( var i = 0; i < count; i++) {
			func();
		}
		var end = new Date();
		console.log(msg + (end - start) + 'ms');
	}

	calculate(function() {
		var obj = create();
		for (var p in obj) {
			delete obj[p];
		}
	}, 'delete: ');
	calculate(function() {
		var obj = create();
		for (var p in obj) {
			obj[p] = null;
		}
	}, 'null: ');
})();