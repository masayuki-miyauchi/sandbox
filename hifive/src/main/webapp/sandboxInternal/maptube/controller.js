$(function() {

	var map = null;// mapオブジェクトはcreateMap()とplaceMaker()、selectPoint()にて用いられる
	var marker = null;// マーカーを立てる処理の関係でここで宣言


	var controller = {

		__name: 'controller',
		// ロジックの宣言
		mapLogic: new GoogleMapSearch.MapLogic(),
		tubeLogic: new Tube.TubeLogic(),
		// tubeLogic : new TubeLogic(),

		__init: function() {// HTML文が読み込まれた時の初期動作

			var that = this;
			this.createMap();

			// イベントリスナの追加
			google.maps.event.addListener(map, 'click', function(event) {
				that.placeMaker(event.latLng);// マーカーの描画
				that.selectPoint(event.latLng, map);// 取得した座標から住所を求める
				that.geoCoding(event.latLng);// 座標の取得
			});

		},

		/* 地図の描画を行うメソッド */
		createMap: function() {
			var latlng;// 最初に描画されるマップ
			latlng = new google.maps.LatLng(39.694, 141.154);// マップを取得

			var myOptions = {// マップの情報を指定
				zoom: 8,// ズームレベル
				center: latlng,// 地図の中心にあわせて初期画面が動く
				mapTypeId: google.maps.MapTypeId.ROADMAP
			};

			map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);// マップオブジェクトの生成

		},
		/* クリック時にマーカーを立てるメソッド */
		placeMaker: function(location) {

			if (marker != null) {
				marker.setMap(null);// 前に存在したマーカーを消す
				marker = new google.maps.Marker({
					position: location,
					map: map
				// マーカーを生成する
				});
			} else {
				marker = new google.maps.Marker({
					position: location,
					map: map
				// マーカーを生成する
				});

			}
			return location;
		},

		/* クリックポイントから取得した座標を画面に表示するメソッド */
		geoCoding: function(location) {

			// 経度と緯度をHTML文に出力
			$("#latitude").html(location.lat());// 経度
			$("#lngitude").html(location.lng());// 緯度
			this.mapLogic.codeLatlng(location).done(
					function(address) {
						$("#address").html(
								'<form id="address"><input type="text"value="' + address
										+ '" size="60"></input></form>');
					});
		},

		/* マップがクリックされた際のマーカーを再描画、住所の表示 */
		selectPoint: function(location) {

			this.mapLogic.codeLatlng(location).done(function(address) {
				var infowindow = new google.maps.InfoWindow();// インフォウィンドウ
				/* マーカーの再描画 */
				map.setZoom(11);
				marker.setMap(null);
				marker = new google.maps.Marker({
					position: location,
					map: map
				});
				infowindow.setContent(address);
				infowindow.open(map, marker);// クリック時に住所がマーカーの上に描画される
			}).fail(function(result) {
				console.log(result);
			});

		},

		/* youtube動画検索ボタン押下時の動画検索 */
		'#button click': function() {
			var location = marker.position;
			var that = this;
			$("#result").html("loading....");
			this.mapLogic.codeLatlng(location).done(function(address) {
				that.tubeLogic.searchMovie(address).done(function(data) {
					var html = '';

					if (data.feed.openSearch$totalResults.$t > 0) {
						var entries = data.feed.entry;
						for ( var i = 0; i < entries.length; i++) {
							html += entries[i].content.$t;
						}
					} else {
						html += "<p>not found</p>";
					}

					/* htmlの内容をid=resultを用いてHPへ書きだし */
					document.getElementById("result").innerHTML = html;
				});

			});
		}

	};

	// container要素にcontrollerをバインド
	h5.core.controller('#container', controller);
});