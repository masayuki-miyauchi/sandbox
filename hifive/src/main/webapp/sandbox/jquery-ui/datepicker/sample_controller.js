$(function() {

	var controller = {

		__name: 'DatepickerController',

		__ready: function() {
			$('#datepicker').datepicker();
		}
	};

	// コントローラの作成と要素へのバインド.
	h5.core.controller('#container', controller);
});