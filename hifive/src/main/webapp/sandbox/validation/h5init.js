$(document).bind('h5init', function() {
	// ログ用アスペクト.
	var log = {
		interceptor: h5.core.interceptor.log,
		pointCut: ['all']
	};

	// 実行時間計測用アスペクト.
	var lap = {
		interceptor: h5.core.interceptor.lap,
		pointCut: ['all']
	};
	// global aspects
	h5.core.globalAspects = [log, lap];
});