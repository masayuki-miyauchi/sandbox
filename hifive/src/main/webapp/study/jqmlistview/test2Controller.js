$(function() {
	var test2Controller = {
		__name: 'test2Controller',

		__unbind: function() {
			console.log('test2 unbind');
		}

	};

	h5.ui.jqm.manager.define('test2', null, test2Controller);
});