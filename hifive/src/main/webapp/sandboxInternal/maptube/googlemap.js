$(function() {// HTML文の読み込みが終わった後、関数を実行

	// ロジックのコンストラクタ
	function MapLogic() {}
	;

	/* 逆ジオコーディングを行い、住所取得するメソッド */
	MapLogic.prototype.codeLatlng = function(location) {
		// var marker = null;
		// var results = null;//住所情報が入る配列
		// var status = null;//値が取れたか判断できる変数

		var lat = location.lat();
		var lng = location.lng();
		var geocoder = new google.maps.Geocoder(); // ジオコーダーオブジェクト
		var df = this.deferred();
		var latlng = new google.maps.LatLng(lat, lng);

		/* 経度も緯度も選択されていない場合 */
		if (lat == null && lng == null) {
			alert("地域を選択してください");
		}

		geocoder.geocode({
			'latLng': latlng
		}, function(results, status) {
			if (status != google.maps.GeocoderStatus.OK) {
				df.reject(address);
				return;
			}

			// result[1]の中の要素を文字列としてaddressへ格納
			var address = results[1].formatted_address;
			df.resolve(address);
		});

		return df.promise();
	};

	/* 名前領域とロジックのバインド */
	h5.u.exposeObject('GoogleMapSearch', {
		MapLogic: MapLogic
	});
});
