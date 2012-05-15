$(function() {
	var test2Controller = {

		__name: 'Test2Controller',

		__construct: function(context) {
			this.log.info(context.args.prop + ' is created.');
		},

		'.testBtn click': function() {
			console.log('test2');
		}
	};

	h5.ui.jqm.manager.define('test2', 'css/test2.css', test2Controller, {prop: 'Test2Controller'});
});