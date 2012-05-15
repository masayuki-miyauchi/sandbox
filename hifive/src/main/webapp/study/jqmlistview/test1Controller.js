$(function() {
	var test1Controller = {
		__name: 'test1Controller',

		__unbind:function(){
			console.log('test1 unbind');
		}
	};

	h5.ui.jqm.manager.define('test1', null, test1Controller);
});