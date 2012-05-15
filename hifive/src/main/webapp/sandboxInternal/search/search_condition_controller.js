$(function() {

	// コントローラの作成とバインド
	var controller = {

		__name: 'SearchConditionController',

		// 使用するテンプレート
		__templates: 'option.ejs',

		// ロジック
		searchLogic: new SearchLogic(),

		__ready: function(context) {
			var current = this.searchLogic.getCurrent();
			this.update(current);
		},

		'select.from change': function(context) {
			this.update(this.getFrom());
		},

		getFrom: function() {
			var year = $('#fYear option:selected').val();
			var month = $('#fMonth option:selected').val();
			var date = $('#fDate option:selected').val();
			return {
				year: parseInt(year),
				month: parseInt(month),
				date: parseInt(date)
			};
		},

		getTo: function() {
			var year = $('#tYear option:selected').val();
			var month = $('#tMonth option:selected').val();
			var date = $('#tDate option:selected').val();
			return {
				year: parseInt(year),
				month: parseInt(month),
				date: parseInt(date)
			};
		},

		update: function(current) {
			var tomorrow = this.searchLogic.getTomorrow(current.year, current.month, current.date);
			var years = this.searchLogic.getYear();
			var months = this.searchLogic.getMonth();
			var dates = this.searchLogic.getDate(current.year, current.month);

			var fYear = h5.core.view.get('option', {
				current: current.year,
				result: years
			});
			var fMonth = h5.core.view.get('option', {
				current: current.month,
				result: months
			});
			var fDate = h5.core.view.get('option', {
				current: current.date,
				result: dates
			});

			var tYear = current.year === tomorrow.year ? fYear : h5.core.view.get('option', {
				current: tomorrow.year,
				result: years
			});
			var tMonth = current.month === tomorrow.month ? fMonth : h5.core.view.get('option', {
				current: tomorrow.month,
				result: months
			});

			var tDates = current.year === tomorrow.year && current.month === tomorrow.month ? dates
					: this.searchLogic.getDate(tomorrow.year, tomorrow.month);
			var tDate = h5.core.view.get('option', {
				current: tomorrow.date,
				result: tDates
			});


			$('#fYear').html(fYear);
			$('#fMonth').html(fMonth);
			$('#fDate').html(fDate);
			$('#tYear').html(tYear);
			$('#tMonth').html(tMonth);
			$('#tDate').html(tDate);
		},

		'#scForm submit': function(context) {
			context.event.preventDefault();

			var from = this.getFrom();
			var to = this.getTo();
			var errMsg = this.searchLogic.checkDate(from, to);
			if (errMsg) {
				$('#error').html(errMsg);
				return;
			}
			var keyword = $('#keyword').val();
			var searchCondition = {
				from: from,
				to: to,
				keyword: keyword
			};
			this.trigger('search', searchCondition);
		}
	};

	h5.core.controller('#searchCondition', controller);
});