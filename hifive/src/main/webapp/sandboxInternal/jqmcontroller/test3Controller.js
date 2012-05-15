$(function() {
	var test3Controller = {

		__name: 'Test3Controller',

		'.testBtn click': function() {
			console.log('test3');
		}
	};

	h5.ui.jqm.manager.define('test3', ['css/test3.css'], test3Controller);
});