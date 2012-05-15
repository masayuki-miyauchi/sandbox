$(function() {
	var test4Controller = {

		__name: 'Test4Controller',

		'.testBtn click': function() {
			console.log('test4');
		},

		'#test3Click click': function() {
			$('#test3 .testBtn').click();
		}
	};

	h5.ui.jqm.manager.define('test4', null, test4Controller);
});