$(function() {

	function LoopLogic() {}
	LoopLogic.prototype = {
		__name: 'LoopLogic',

		loop: function() {
			for ( var i = 0; i < 1000000; i++) {
				if (i % 10000 === 0)
					this.log.info(i);
			}
		}
	};

	var loopController = {
		__name: 'LoopController',

		loopLogic: new LoopLogic(),

		'#btn click': function() {
			this.loopLogic.loop();
		}
	};

	h5.core.controller('#container', loopController);
});