$('#player-page').live('pagebeforehide', function() {
	$(window).unbind('orientationchange');
	$('#player-page iframe').remove();
});

$('#player-page').live('pageshow', function() {
	var $iframe = $('#player-page iframe');

	$(window).bind('orientationchange', function() {
		$iframe.animate({
			height: ($('body').height() - 20)
		}, 'normal', function() {
			window.scrollTo(0, 1);
		});

	});
});