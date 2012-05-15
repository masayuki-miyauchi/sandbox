$(function() {
	var test3Controller = {
		__name: 'test3Controller',

		__unbind: function() {
			console.log('test3 unbind');
		}
	};

	h5.ui.jqm.manager.define('test3', null, test3Controller);
});