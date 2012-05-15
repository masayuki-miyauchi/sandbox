$(function() {
	function dump(msg) {
		$('#ul').prepend('<li>' + msg + '</li>');
	}
	var mainController = {
		__name: 'mainController',
		__ready: function(context) {
			this['{window} resize'](context);
		},
		'{window} resize': function(context) {
			this.$find('#main').height($(window).height() - 370 + 'px');
			if (parseInt(this.$find('.wrap').css('min-width')) > window.innerWidth) {
				$('#main').css('overflow-x', 'scroll');
			} else {
				$('#main').css('overflow-x', 'hidden');
			}
		},
		'.child click': function(context) {
			var $target = $(context.event.target);
			var id = $target.attr('id');
			$('button').each(function() {
				this.innerText = this.innerText.replace(/\{\w+\}|\"#\w+\"/ig, '"#' + id + '"');
			});
			dump($target.attr('id') + ' selected');
			if ($target.hasClass('moving')) {
				$target.removeClass('moving');
			} else {
				$('.moving').removeClass('moving');
				$target.addClass('moving');
			}
		},
		'{window} keydown': function(context) {
			var keyCode = context.event.keyCode;
			var $target = this.$find('.moving');
			if ($target.length === 0) {
				return;
			}
			var pos = {
				left: parseInt($target.css('left')) || 0,
				top: parseInt($target.css('top')) || 0
			};
			var d = (context.event.shiftKey) ? 10 : 1;
			if (37 <= keyCode && keyCode <= 40) {
				context.event.preventDefault();
				if (keyCode === 37)
					pos.left -= d;
				else if (keyCode === 39)
					pos.left += d;
				else if (keyCode === 40)
					pos.top += d;
				else if (keyCode === 38)
					pos.top -= d;
			} else
				return;
			$target.css({
				position: 'relative',
				left: pos.left + 'px',
				top: pos.top + 'px'
			});
			$target.html(h5.u.str.format('{0}<br>offsetLeft={1}<br>offsetTop={2}', $target
					.attr('id'), $target.offset().left, $target.offset().top));
		},
		'{button} click': function(context) {
			var rootSelector = context.event.target.getAttribute('name');
			if (rootSelector === 'window') {
				rootSelector = window;
			}
			if (rootSelector === '') {
				rootSelector = undefined;
			}
			dump(h5.ui.isInView('.moving', rootSelector));
		}
	};
	h5.core.controller('body', mainController);
});