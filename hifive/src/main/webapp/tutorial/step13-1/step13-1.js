$(function() {
	var helloWorldController = {
		__name: 'HelloWorldController',

		'#btn click': function() {
			alert('Hello, World!');
		}
	};

	// id="container"である要素にコントローラをバインド
	h5.core.controller('#container', helloWorldController);
});