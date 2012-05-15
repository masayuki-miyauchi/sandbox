$(function() {
	var test5Controller = {

		__name: 'Test5Controller',

		'.testBtn click': function() {
			console.log('test5');
		}
	};

	h5.ui.jqm.manager.define('test5', 'css/test5.css', test5Controller);
});