$(function() {
	var func = function(event, eventName) {
		var originalEvent = event.originalEvent;
		var detail = originalEvent.detail;
		var wheelDelta = originalEvent.wheelDelta;
		alert(eventName + ': detail-"' + detail + '", wheelDelta-"' + wheelDelta + '"');
	};
	$(window).bind('mousewheel', function(event) {
		func(event, 'window mousewheel');
	});
	$(window).bind('DOMMouseScroll', function(event) {
		func(event, 'window DOMMouseScroll');
	});
	$(document).bind('mousewheel', function(event) {
		func(event, 'document mousewheel');
	});
	$(document).bind('DOMMouseScroll', function(event) {
		func(event, 'document DOMMouseScroll');
	});
});