$(function() {
	var ua = h5.env.ua;
	if (ua.isChrome) {
		$('body').text('Chrome');
		console.log('Chrome');
		return;
	}
	if (ua.isFirefox) {
		$('body').text('Firefox');
		console.log('Firefox');
		return;
	}
	if (ua.isIE) {
		$('body').text('IE');
		window.console || console.log('IE');
		$('body').text('IE' + ua.browserVersionFull);
		return;
	}
});