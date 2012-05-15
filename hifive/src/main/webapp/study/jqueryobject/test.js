$(function() {
	var isJQueryObject = function(obj) {
		if (!obj || !obj.jquery) {
			return false;
		}
		return (obj.jquery === $().jquery);
	};
	// is
	function getJQueryObj1(obj) {
		return isJQueryObject(obj) ? obj : $(obj);
	}
	// $に直接入れる
	function getJQueryObj2(obj) {
		return $(obj);
	}

	var jTarget = $('body');
	var target = jTarget.get(0);
	var count = 10000;

	function calculate(elm, func, msg) {
		var start = new Date();
		for ( var i = 0; i < count; i++) {
			var test = func(elm);
		}
		var end = new Date();
		console.log(msg + (end - start) + 'ms');
	}
	function calculate2(msg) {
		var start = new Date();
		for ( var i = 0; i < count; i++) {
			var test = $('body');
		}
		var end = new Date();
		console.log(msg + (end - start) + 'ms');
	}

	calculate(jTarget, getJQueryObj1, 'isで判定(対象がjQueryオブジェクト): ');
	calculate(target, getJQueryObj1, 'isで判定(対象がDOMオブジェクト): ');
	calculate(jTarget, getJQueryObj2, '$に直接入れる(対象がjQueryオブジェクト): ');
	calculate(target, getJQueryObj2, '$に直接入れる(対象がDOMオブジェクト): ');

	calculate2('セレクタを使って普通に作る: ');
});