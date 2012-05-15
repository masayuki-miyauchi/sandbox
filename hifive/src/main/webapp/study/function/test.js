(function() {
	var test;
	// var-var
	var test1 = function() {
		var inner = function() {
			test = 'var-var';
		};
		inner();
	};

	// var-f
	var test2 = function() {
		function inner() {
			test = 'var-f';
		}
		inner();
	};

	// f-var
	function test3() {
		var inner = function() {
			test = 'f-var';
		};
		inner();
	}

	// f-f
	function test4() {
		function inner() {
			test = 'f-f';
		}
		inner();
	}

	var count = 1000000;

	function calculate(func, msg) {
		var start = new Date();
		for ( var i = 0; i < count; i++) {
			func();
		}
		var end = new Date();
		console.log(msg + (end - start) + 'ms');
	}

	calculate(test1, 'var-var: ');
	calculate(test2, 'var-f: ');
	calculate(test3, 'f-var: ');
	calculate(test4, 'f-f: ');
})();