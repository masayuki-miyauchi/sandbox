var controller = {
	__ready: function() {
		$('#message').append('<div>init executed.</div>');
	},
	__name: 'mainPageController',

	// ------------- グローバルオブジェクト系 ----------------------------

	'{window} [resize]': function() {
		$('#message').append('<div>window resize.</div>'); // 同じ条件のインターセプタが登録されると、実行されない
	},
	'{window} [scroll]': function() {
		$('#message').append('<div>window scroll.</div>');
	},


	// ---------------JQMのdata-role指定でイベントが発火するか--------------

	'select[role=slider] change': function() {
		$('#message').append('<div>Flip switch change.</div>');
	},

	// ------------- Textbox:Text----------------------------

	'#name click': function(context) {
		$('#message').append('<div>text input click.</div>');
	},
	'#name focus': function(context) {
		$('#message').append('<div>text input focus.</div>');
	},
	'#name change': function(context) {
		var elem = context.event.target;
		$('#message').append('<div>text input change. value:' + elem.value + '</div>');
	},
	'#name keydown': function(context) {
		var elem = context.event.target;
		$('#message').append('<div>text input keydown. value:' + elem.value + '</div>');
	},
	'#name keyup': function(context) {
		var elem = context.event.target;
		$('#message').append('<div>text input keyup. value:' + elem.value + '</div>');
	},

	// ------------- Textbox:Search----------------------------

	'#textarea click': function(context) {
		$('#message').append('<div>textarea click.</div>');
	},
	'#textarea focus': function(context) {
		$('#message').append('<div>textarea focus.</div>');
	},
	'#textarea change': function(context) {
		$('#message').append('<div>textarea change.</div>');
	},
	'#textarea keydown': function() {
		$('#message').append('<div>textarea keydown.</div>');
	},
	'#textarea keyup': function() {
		$('#message').append('<div>textarea keyup.</div>');
	},

	// ------------- Textbox:Search----------------------------

	'#search click': function(context) {
		$('#message').append('<div>Search Input click.</div>');
	},
	'#search focus': function(context) {
		$('#message').append('<div>Search Input focus.</div>');
	},
	'#search change': function(context) {
		$('#message').append('<div>Search Input change.</div>');
	},
	'#search keydown': function() {
		$('#message').append('<div>Search Input keydown.</div>');
	},
	'#search keyup': function() {
		$('#message').append('<div>Search Input keyup.</div>');
	},

	// ------------- Flip Switch----------------------------

	'#slider2 click': function(context) {
		$('#message').append('<div>Flip switch click.</div>');
	},
	'#slider2 focus': function(context) {
		$('#message').append('<div>Flip switch focus.</div>');
	},
	'#slider2 change': function(context) {
		var elem = context.event.target;
		$('#message').append('<div>Flip switch change. value:' + elem.value + '</div>'); // 複数回実行される
		// &
		// 初回表示時に実行される
	},
	'#slider2 keydown': function() {
		$('#message').append('<div>Flip switch keydown.</div>');
	},
	'#slider2 keyup': function() {
		$('#message').append('<div>Flip switch keyup.</div>');
	},

	// ------------- Slider ----------------------------
	'#slider1 click': function(context) {
		$('#message').append('<div>Slider click.</div>');
	},
	'#slider1 focus': function(context) {
		$('#message').append('<div>Slider focus.</div>');
	},
	'#slider1 change': function(context) {
		var elem = context.event.target;
		$('#message').append('<div>Slider change. value:' + elem.value + '</div>'); // 初回表示時に実行される
	},
	'#slider1 keydown': function() {
		$('#message').append('<div>Slider keydown.</div>');
	},
	'#slider1 keyup': function() {
		$('#message').append('<div>Slider keyup.</div>');
	},

	// ------------- Checkbox:Cheetos ----------------------------
	'#checkbox-1a click': function(context) {
		$('#message').append('<div>Checkbox:Cheetos click.</div>');
	},
	'#checkbox-1a focus': function(context) {
		$('#message').append('<div>Checkbox:Cheetos focus.</div>');
	},
	'#checkbox-1a change': function(context) {
		var elem = context.event.target;
		$('#message').append('<div>Checkbox:Cheetos change. value:' + elem.value + '</div>');
	},
	'#checkbox-1a keydown': function() {
		$('#message').append('<div>Checkbox:Cheetos keydown.</div>');
	},
	'#checkbox-1a keyup': function() {
		$('#message').append('<div>Checkbox:Cheetos keyup.</div>');
	},

	// ------------- Checkbox:Doritos ----------------------------
	'#checkbox-2a click': function(context) {
		$('#message').append('<div>Checkbox:Doritos click.</div>');
	},
	'#checkbox-2a focus': function(context) {
		$('#message').append('<div>Checkbox:Doritos focus.</div>');
	},
	'#checkbox-2a change': function(context) {
		var elem = context.event.target;
		$('#message').append('<div>Checkbox:Doritos change. value:' + elem.value + '</div>');
	},
	'#checkbox-2a keydown': function() {
		$('#message').append('<div>Checkbox:Doritos keydown.</div>');
	},
	'#checkbox-2a keyup': function() {
		$('#message').append('<div>Checkbox:Doritos keyup.</div>');
	},

	// ------------- Radio ----------------------------
	'input[name=radio-choice-1] change': function() {
		$('#message').append(
				'<div>Radio change. value:' + $('input[type="radio"]:checked').val() + '</div>');
	},

	// ------------- Select ----------------------------
	'select[name=select-choice-3] change': function() {
		$('#message').append(
				'<div>Radio change. value:'
						+ $('select[name="select-choice-3"] option:selected').val() + '</div>');
	},

	// ------------- Select ----------------------------
	'select[name=select-choice-a] change': function() {
		$('#message').append(
				'<div>Select change. value:'
						+ $('select[name="select-choice-a"] option:selected').val() + '</div>');
	},

	// ------------- Submit ----------------------------
	'#submit1 click': function(context) {
		var df = this.deferred();
		$('#message').append('<div>Submit Button click.</div>');

		var indicator = this.indicator({
			target: document.body,
			message: 'global block'
		}).show();

		setTimeout(function() {
			indicator.hide();
			df.resolve();
		}, 5000);

		return df.promise();
	},

	'#submit2 click': function(context) {
		var df = this.deferred();
		$('#message').append('<div>Submit Button click. </div>');

		var indicator = this.indicator({
			target: $(this.rootElement).parent(),
			message: 'parent block'
		}).show();

		setTimeout(function() {
			indicator.hide();
			df.resolve();
		}, 5000);

		return df.promise();
	}
};

var controller2 = {
	__name: 'listViewontroller',
	'a click': function() {
		$('#message').append('<div>listview selected.</div>');
	}
};

;
