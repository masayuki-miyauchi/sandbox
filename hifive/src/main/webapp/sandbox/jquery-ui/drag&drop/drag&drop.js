$(function() {

	var controller = {

		__name: 'Drag&DropController',

		// 初期化処理
		__ready: function() {
			var that = this;

			$('#draggable').draggable();
			$('#droppable').droppable({
				drop: that.ownWithOrg(that.drop)
			});
		},

		// 要素がドロップされた時のコールバック
		drop: function(org, event, ui) {
			$(org).addClass('ui-state-highlight').find('p').html('Dropped!');
		}
	};

	// コントローラの作成と要素へのバインド.
	h5.core.controller('#container', controller);
});