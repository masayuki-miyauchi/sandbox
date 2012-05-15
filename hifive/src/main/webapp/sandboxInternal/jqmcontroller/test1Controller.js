$(function() {
	var test1Controller = {

		__name: 'Test1Controller',

		'.testBtn click': function() {
			console.log('test1');
		}
	};

	h5.ui.jqm.manager.define('test1', 'css/test1.css', test1Controller);
});