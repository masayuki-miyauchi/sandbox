$(function() {

	var controller = {

		__name: 'SortableController',

		__ready: function() {
			var that = this;
			$('.column').sortable({
				connectWith: '.column',
				stop: that.own(that.stop)
			});

			$('.portlet').addClass('ui-widget ui-widget-content ui-helper-clearfix ui-corner-all')
					.find('.portlet-header').addClass('ui-widget-header ui-corner-all').prepend(
							'<span class="ui-icon ui-icon-minusthick"></span>').end().find(
							'.portlet-content');

			$('.portlet-header .ui-icon').click(function() {
				$(this).toggleClass('ui-icon-minusthick').toggleClass('ui-icon-plusthick');
				$(this).parents('.portlet:first').find('.portlet-content').toggle();
			});

			$('.column').disableSelection();
		},

		stop: function(event, ui) {
			var target = $(ui.item);
			$('#list').append('<li>' + target.find('.portlet-header').text() + 'が移動しました。</li>');
		}
	};

	// コントローラの作成と要素へのバインド.
	h5.core.controller('#container', controller);
});