$(function() {
	function GridLogic() {
	//
	}

	GridLogic.prototype.__name = 'GridLogic';

	GridLogic.prototype.getInitialData = function(context, total) {
		var df = this.deferred();

		setTimeout(function() {
			var deleteBtn = '<span style="color: red;">削除</span>';

			var ret = [];
			for ( var i = 1; i < total; i++) {
				var data = {
					userId: '<span class="userId">' + i + '</span>',
					userName: 'userName_' + i,
					password: 'password_' + i,
					deleteBtn: deleteBtn
				};
				ret.push(data);
			}

			df.resolve(ret);
		}, 1200);

		return df.promise();
	};

	var controller = {
		__name: 'GridController',
		index: 0,
		// ロジック
		gridLogic: new GridLogic(),
		__ready: function() {
			var that = this;
			// jqGridの初期化
			this.grid = $('#grid').jqGrid({
				datatype: 'local',
				colNames: ['ユーザID', '名前', 'パスワード', '削除'],
				colModel: [{
					name: 'userId',
					index: 'userId',
					width: 120,
					sorttype: 'int',
					align: 'right'
				}, {
					name: 'userName',
					index: 'userName',
					width: 120,
					sorttype: 'text',
					align: 'right',
					editable: true
				}, {
					name: 'password',
					index: 'password',
					width: 120,
					sorttype: 'text',
					align: 'right',
					editable: true
				}, {
					name: 'deleteBtn',
					index: 'deleteBtn',
					width: 40,
					sortable: false,
					align: 'right'
				}],
				pager: $('#pager'),
				rowNum: 10,
				rowList: [10, 20, 300],
				sortname: 'id',
				sortorder: 'desc',
				viewrecords: true,
				imgpath: 'themes/basic/images',
				caption: 'hifive Grid',
				// セルを選択した時のコールバック
				onCellSelect: that.ownWithOrg(that.selectCell)
			});
			this.block();

			// GridLogic#getInitialDataを実行し初期データを取得
			// 非同期処理なのでpromiseが返る。
			var logicPromise = this.gridLogic.getInitialData(120);
			// ロジックの非同期処理が終了したらグリッドに追加
			logicPromise.done(function(ret) {
				var i = 0;
				var len = ret.length;
				for (; i < len; i++) {
					that.grid.addRowData(undefined, ret[i]);
				}
				that.grid.trigger("reloadGrid");
				that.index = i;
				that.unblock();
			});
		},

		// データの追加処理
		'input[name=addData] click': function(context) {
			this.index += 1;

			var data = {
				userId: '<span class="userId">' + this.index + '</span>',
				userName: 'userName_' + this.index,
				password: 'password_' + this.index,
				deleteBtn: '<span style="color: red;">削除</span>'
			};

			$('#grid').addRowData(undefined, data);
			this.grid.trigger("reloadGrid");
		},

		selectCell: function(cellcontent, context, rowId, iCol) {
			var lastSeletedRow = this.lastSeletedRow;
			if (cellcontent === '削除') {
				if (confirm('本当に削除しますか？')) {
					$('#grid').delRowData(rowId);
				}
			} else if (rowId && rowId !== lastSeletedRow) {
				$('#grid').jqGrid('restoreRow', lastSeletedRow);
				$('#grid').jqGrid('editRow', rowId, true, null, null, 'clientArray');
				this.lastSeletedRow = rowId;
			}
		}
	};

	// コントローラの作成と要素へのバインド.
	h5.core.controller('#container', controller);
});