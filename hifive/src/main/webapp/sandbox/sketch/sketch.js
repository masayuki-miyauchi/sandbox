$(function() {



	/**
	 * FixController
	 *
	 * @name FixController
	 * @namespace
	 */
	var fixController = {

		/**
		 * コントローラ名
		 *
		 * @memberOf FixController
		 */
		__name: 'FixController',

		/**
		 * 固定対象のDOM
		 *
		 * @memberOf FixController
		 */
		$fix: {},

		/**
		 * 座標の操作位置 このコントローラーがDOMの座標を操作する基準点 left=top=trueなら 左上、left=top=false なら右下。
		 *
		 * @memberOf FixController
		 */
		pinPoint: {
			left: true,
			top: true
		},

		/**
		 * 初期位置(__ready()で初期化)
		 *
		 * @memberOf FixController
		 */
		fixPos: {
			x: 0,
			y: 0
		},


		/**
		 * initイベント 初期位置の指定
		 *
		 * @param {Object} context コンテキスト
		 * @memberOf FixController
		 */
		__ready: function(context) {
			this.$fix = $('.fixContents');
			var zoomScale = document.body.clientWidth / window.innerWidth;

			var originX = (this.pinPoint.left) ? '0' : '100%';
			var originY = (this.pinPoint.top) ? '0' : '100%';
			this.$fix.css('-webkit-transform-origin', originX + ' ' + originY);

			// 初期固定位置
			this.fixPos.x = 0;
			this.fixPos.y = $(window).height() - this.$fix.height();

			this.showFixContents();
		},
		/**
		 * touchした時に$fixを隠す
		 *
		 * @param {Object} context コンテキスト
		 * @memberOf FixController
		 */
		'{window} [touchstart]': function(context) {
			this.$fix.toggle();
		},

		/**
		 * touchend時に$fixを表示
		 *
		 * @param {Object} context コンテキスト
		 * @memberOf FixController
		 */
		'{window} [touchend]': function(context) {
			this.showFixContents();
		},

		/**
		 * スクロール終了時に$fixを表示
		 *
		 * @param {Object} context コンテキスト
		 * @memberOf FixController
		 */
		'{window} [scroll]': function(context) {
			this.showFixContents();
		},

		/**
		 * touch時に$fixを隠す
		 *
		 * @param {Object} context コンテキスト
		 * @memberOf FixController
		 */
		'{window} [gesturestart]': function(context) {
			this.$fix.toggle();
		},

		/**
		 * guestuerend時(拡縮終了時)に$fixを表示
		 *
		 * @param {Object} context コンテキスト
		 * @memberOf FixController
		 */
		'{window} [gestureend]': function(context) {
			this.showFixContents();
		},

		/**
		 * $fixをtouchしたときにバブリングさせない
		 *
		 * @param {Object} context コンテキスト
		 * @memberOf FixController
		 */
		'.fixContents touchstart': function(context) {
			context.event.stopPropagation();
		},

		/**
		 * 固定するDOMの表示
		 *
		 * @memberOf FixController
		 */
		showFixContents: function() {
			var zoomScale = document.body.clientWidth / window.innerWidth;
			var h = w = 0;
			if (!this.pinPoint.left) {
				w = this.$fix.width();
			}
			if (!this.pinPoint.top) {
				h = this.$fix.height();
			}
			this.$fix.css('-webkit-transform', 'scale(' + 1 / zoomScale + ')');
			this.$fix.css('left', this.fixPos.x / zoomScale + $(window).scrollLeft() - w + 'px');
			this.$fix.css('top', this.fixPos.y / zoomScale + $(window).scrollTop() - h + 'px');
			this.$fix.css('display', 'block');
		},

		/**
		 * 指定された位置へ移動
		 *
		 * @param x x座標
		 * @param y y座標
		 * @param fix 移動した位置へ固定するかどうか
		 * @memberOf FixController
		 */
		move: function(x, y, fix) {
			var $sketchTool = $('#sketchTool');
			var h = w = 0;
			if (!this.pinPoint.left) {
				w = this.$fix.width();
			}
			if (!this.pinPoint.top) {
				h = this.$fix.height();
			}
			$sketchTool.css('left', x - w + 'px');
			$sketchTool.css('top', y - h + 'px');
			if (fix) {
				this.fix();
			}
		},

		/**
		 * $fixを現在位置で固定する
		 *
		 * @memberOf FixController
		 */
		fix: function(x, y) {
			var zoomScale = document.body.clientWidth / window.innerWidth;
			var h = w = 0;
			if (!this.pinPoint.left) {
				w = this.$fix.width();
			}
			if (!this.pinPoint.top) {
				h = this.$fix.height();
			}
			this.fixPos.x = (parseInt(this.$fix.css('left')) - $(window).scrollLeft() + w)
					* zoomScale;
			this.fixPos.y = (parseInt(this.$fix.css('top')) - $(window).scrollTop() + h)
					* zoomScale;
		}
	};

	/**
	 * SketchController
	 *
	 * @name SketchController
	 * @namespace
	 */
	var sketchController = {

		/**
		 * コントローラ名
		 *
		 * @memberOf SketchController
		 */
		__name: 'SketchController',
		/**
		 * 使用するテンプレート
		 *
		 * @memberOf SketchController
		 */
		__templates: 'sketch.ejs',

		/**
		 * 太さ
		 *
		 * @memberOf SketchController
		 */
		lineWidth: 5,

		/**
		 * 色
		 *
		 * @memberOf SketchController
		 */
		lineColor: '#ff0000', // TODO ペンの色の初期値がテンプレートとここに分散している

		/**
		 * 描画するかどうか.
		 *
		 * @memberOf SketchController
		 */
		drawFlag: false,

		/**
		 * 描画モード.
		 *
		 * @memberOf SketchController
		 */
		isDrawMode: false,

		/**
		 * initイベント
		 *
		 * @param {Object} context コンテキスト
		 * @memberOf SketchController
		 */
		__init: function(context) {
			// append DOM
			var $target = $(this.rootElement);
			this.view.update($target, 'sketch', {
				width: $target.innerWidth(),
				height: $target.innerHeight(),
				lineWidth: this.lineWidth,
				lineColor: this.lineColor,
				// input type="range"が使えるかどうか。つかえない場合はdiv要素で作成する。(Operaは-webkit-appearanceがつかえないので、divに置き換える。)
				enableInputRange: !(h5.env.ua.isIE || h5.env.ua.isFirefox || h5.env.ua.isOpera)
			});
			// TODO コントローラを分割すれば不要になる.
			var sc = this.$find('#sketchContainer');
			sc.empty();
			var w = sc.innerWidth();
			var h = sc.innerHeight();
			sc.append('<canvas id="sketchCanvas" width="' + w + '" height="' + h + '"></canvas>');

			this.isDrawMode = true;
			this.$find('#drawModeSwitch').text('ON');
			this.$find('#drawModeSwitch').removeClass('off');
			this.$find('#drawModeSwitch').addClass('on');
		},

		/**
		 * 色や太さなど、線のツールボタンが押されたら対応するツールを開く
		 *
		 * @param context
		 */
		'button.toolLabel click': function(context) {
			var target = context.event.target;
			var tool = $(target.parentElement).find('.toolContents');
			tool.toggle();
		},

		/**
		 * 描画モード切替ボタン
		 *
		 * @param context
		 */
		'button#drawModeSwitch click': function(context) {
			var target = context.event.target;
			this.isDrawMode = !this.isDrawMode;
			if (this.isDrawMode) {
				$(target).text('ON');
				$(target).removeClass('off');
				$(target).addClass('on');
			} else {
				$(target).text('OFF');
				$(target).removeClass('on');
				$(target).addClass('off');
			}
		},

		/**
		 * スケッチツールの移動
		 *
		 * @param context
		 */
		'#handle h5trackstart': function(context) {
			context.event.stopPropagation();
		},
		'#handle h5trackmove': function(context) {
			context.event.preventDefault();
			context.event.stopPropagation();
			var dx = context.event.dx;
			var dy = context.event.dy;
			this.fixController.move(parseInt(this.$find('#sketchTool').css('left')) + dx, parseInt(this.$find('#sketchTool').css('top')) + dy, false);
		},
		'#handle h5trackend': function(context) {
			context.event.stopPropagation();
			this.fixController.fix();
		},

		/**
		 * ペンの太さの変更
		 *
		 * @param context
		 */
		'#lineWidth change': function(context) {
			var $target = $(context.event.target);
			var lineWidth = $target.val();
			this.$find('#lineWidthValue').val($target.val());
			this.lineWidth = lineWidth;
		},

		'#lineWidth mouseup': function(context) {
			$(context.event.target).parent().css('display', 'none');
		},

		'#lineWidth touchend': function(context) {
			$(context.event.target).parent().css('display', 'none');
		},

		'#load click': function(context) {
			var $target = this.$find('div.backgroundPieceSelected');
			if (!$target.length) {
				return;
			}

			var targetImg = $target.find('img').get(0);
			var img = new Image();
			img.src = targetImg.src;
			var canvas = this.$find('#sketchCanvas').get(0);
			var ctx = canvas.getContext('2d');
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			img.onload = this.img2Canvas(img, canvas, ctx);
		},

		/**
		 * ペンの太さ変更フラグ(IE,Firefox,Opera用)
		 */
		penRangeMoving: false,

		/**
		 * ペンの太さの変更(IE,Firefox,Opera用)
		 * @param {Object} context コンテキスト
		 * @memberOf SketchController
		 */
		'#rangeSlider h5trackstart': function(context){
			this.penRangeMoving = true;
			context.event.stopPropagation();
		},
		'#rangeSlider h5trackmove': function(context){
			if(!this.penRangeMoving) return;
			var event = context.event;
			event.preventDefault();
			event.stopPropagation();
			var dx = event.dx;


			var $slider = this.$find('#rangeSlider');
			var left = parseInt($slider.css('left'));
			left += dx;
			var $bar = this.$find('#rangeBar');
			leftLim = parseInt($bar.css('left'));
			rightLim = parseInt($bar.css('left')) + parseInt($bar.css('width')) - parseInt($slider.css('width'));
			if((leftLim < left || dx > 0) && (left < rightLim || dx < 0)){
				$slider.css('left', left  + 'px');
			} else{
				$slider.css('left', left  + 'px');
				if(dx > 0){
					left = rightLim;
				} else {
					left = leftLim;
				}
				$slider.css('left', left + 'px');
				if(event.offsetX < 0 || event.offsetY < 0 || event.offsetX > $slider.innerWidth() || event.offsetY > $slider.innerHeight()){
					$slider.trigger('h5trackend');
				}
			}
			var lineWidth = parseInt(1 + 39 * (parseInt($slider.css('left')) - leftLim) / (rightLim - leftLim));
			this.$find('#lineWidthValue').val(lineWidth);
			this.lineWidth = lineWidth;
		},
		'#rangeSlider h5trackend': function(context) {
			$(context.event.target).parent().css('display', 'none');
			this.penRangeMoving = false;
		},

		/**
		 * クリックでペンの太さ変更(IE,Firefox,Opera用)
		 *
		 * @param {Object} context コンテキスト
		 * @memberOf SketchController
		 */
		'.toolContents mousedown': function(context){
			console.log('click')
			var $bar = this.$find('#rangeBar');
			var $slider = this.$find('#rangeSlider');
			leftLim = parseInt($bar.css('left'));
			rightLim = parseInt($bar.css('left')) + parseInt($bar.css('width')) - parseInt($slider.css('width'));
			var x = context.event.offsetX;
			if(leftLim < x && x < rightLim){
				$slider.css('left', x  + 'px');
				var lineWidth = parseInt(1 + 39 * (parseInt($slider.css('left')) - leftLim) / (rightLim - leftLim));
				this.$find('#lineWidthValue').val(lineWidth);
				this.lineWidth = lineWidth;
				this.penRangeMoving = true;
			}
		},
		'.toolContents mouseup': function(context){
			if(!this.penRangeMoving) return;
			$('.toolContents').css('display', 'none');
			this.penRangeMoving = false
		},

		/**
		 * id="save"の要素でclickイベントが起こったときのハンドラ
		 *
		 * @param {Object} context コンテキスト
		 * @memberOf SketchController
		 */
		'#save click': function(context) {
			// snapshot
			var canvas = this.$find('#sketchCanvas').get(0);
			var data = canvas.toDataURL("image/png");
			this.view.append('#snapshotContainer', 'snapshot', {
				src: data
			});
		},

		/**
		 * id="clear"の要素でclickイベントが起こったときのハンドラ
		 *
		 * @param {Object} context コンテキスト
		 * @memberOf SketchController
		 */
		'#clear click': function(context) {
			var canvas = this.$find('#sketchCanvas').get(0);
			var ctx = canvas.getContext('2d');
			ctx.clearRect(0, 0, canvas.width, canvas.height);
		},

		'div.snapshot click': function(context) {
			var $target = $(context.event.target).parent();

			// TODO バックグラウンド以外のピースにもつけるのでCSSクラス名を変える
			// TODO コード整理
			var add = !$target.hasClass('backgroundPieceSelected');
			this.$find('#backgroundImgContainer').find('div.backgroundPieceSelected').removeClass(
					'backgroundPieceSelected');
			this.$find('#snapshotContainer').find('div.backgroundPieceSelected').removeClass(
					'backgroundPieceSelected');

			if (add) {
				$target.addClass('backgroundPieceSelected');
			}
		},

		'div.backgroundPiece click': function(context) {
			var $target = $(context.event.target).parent();
			var add = !$target.hasClass('backgroundPieceSelected');

			this.$find('#backgroundImgContainer').find('div.backgroundPieceSelected').removeClass(
					'backgroundPieceSelected');
			this.$find('#snapshotContainer').find('div.backgroundPieceSelected').removeClass(
					'backgroundPieceSelected');

			if (add) {
				$target.addClass('backgroundPieceSelected');
			}
		},

		'div.lineColorPiece click': function(context) {
			this.$find('#lineColorTool').find('div.lineColorPiece')
					.removeClass('lineColorSelected');
			var $target = $(context.event.target);
			$target.addClass('lineColorSelected');
			var c = $target.find('input[type=hidden]').val();
			this.lineColor = c;
			$(context.event.target).parent().css('display', 'none');
		},

		'#sketchCanvas h5trackstart': function(context) {
			var mode = this.isDrawMode;
			var event = context.event;
			if (!mode) {
				event.preventDefault();
				return;
			}
			this.drawFlag = true;
		},

		'#sketchCanvas h5trackmove': function(context) {
			if (!this.drawFlag) {
				return;
			}
			this.draw(context.event);
		},

		'#sketchCanvas h5trackend': function(context) {
			this.drawFlag = false;
		},

		draw: function(event) {
			var canvas = this.$find('#sketchCanvas').get(0);
			var ctx = canvas.getContext('2d');
			var x = event.offsetX;
			var y = event.offsetY;
			ctx.strokeStyle = this.lineColor;
			ctx.lineWidth = this.lineWidth;
			ctx.lineJoin = "round";
			ctx.lineCap = "round";
			ctx.beginPath();
			ctx.moveTo(x - event.dx, y - event.dy);
			ctx.lineTo(x, y);
			ctx.stroke();
			ctx.closePath();
		},

		img2Canvas: function(img, canvas, ctx) {
			return function() {
				var w = canvas.width;
				var h = canvas.height;
				var sw = img.width;
				var sh = img.height;

				var srcAspectRatio = sh / sw;
				var canvasAspectRatio = h / w;

				var dx,dy,dw,dh;
				if (canvasAspectRatio >= srcAspectRatio) {
					// canvasの方が横に長い場合
					dw = w;
					dh = w * srcAspectRatio;
					dx = 0;
					dy = (h - dh) / 2;
				} else {
					// canvasの方が縦に長い場合
					dh = h;
					dw = h / srcAspectRatio;
					dx = (w - dw) / 2;
					dy = 0;
				}

				ctx.drawImage(img, 0, 0, sw, sh, dx, dy, dw, dh);
			};
		},

		fixController: fixController,
		__importHandlers: ['fixController']
	};
	h5.core.controller('#container', sketchController);
});