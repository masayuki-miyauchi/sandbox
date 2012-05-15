$(function() {
	var $image = $('#image');
	var $currentA = $('#currentA');
	var $currentB = $('#currentB');
	var $currentC = $('#currentC');

	function orientationEventHandler(ev) {
		var dir = ev.alpha;
		var fb = ev.beta;
		var lr = ev.gamma;

		$image.css('-webkit-transform', 'skewX(' + -lr + 'deg) rotate(' + -dir
				+ 'deg) rotate3d(1,0,0,' + (fb * -1) + 'deg)');
		$currentA.text('alpha(方向):' + dir);
		$currentB.text('beta(前後):' + fb);
		$currentC.text('gamma(左右):' + lr);
	}

	function bindOrientationEvent() {
		window.removeEventListener('deviceorientation', orientationEventHandler, false);
		window.addEventListener('deviceorientation', orientationEventHandler, false);

	}

	bindOrientationEvent();
	$('#resetBtn').click(bindOrientationEvent);
});
