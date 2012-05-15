(function($) {
	/**
	 * watchPositionが返すプロミスオブジェクト。
	 */
	var promise = null;

	/**
	 * 指定された要素にGoogleMapを追加します。
	 *
	 * @param {Object} baseElem GoogleMapを追加する要素
	 * @param {Object} options オプション
	 * @returns {Map} GoogleMapオブジェクト
	 */
	function createMap(baseElem, options) {
		return new google.maps.Map(baseElem, options);
	}

	/**
	 * 指定された緯度と経度から、座標オブジェクトを生成します。
	 *
	 * @param {String} lat 緯度
	 * @param {String} lng 経度
	 * @returns {LatLng} 座標オブジェクト
	 */
	function createLatLng(lat, lng) {
		var lt = lat;
		var lg = lng;
		var LAT = '35.685826';
		var LNG = '139.756684';

		if (arguments.length !== 2) {
			lt = LAT;
			lg = LNG;
		}

		return new google.maps.LatLng(lt, lg);
	}

	var markers = null;

	function clearMarker() {
		markers.forEach(function(elem, idx) {
			if (elem == null) {
				return true;
			}

			elem.setMap(null);
		});

		for ( var i = 0, len = markers.getLength(); i < len; i++) {
			markers.removeAt(i);
		}
	}

	function stopWatchPositon() {
		if (promise && promise.unwatch) {
			promise.unwatch();
			promise = null;
		}
	}

	function readLine(source) {
		return source.replace(/\r\n/g, '\n').replace(/\r|\n/g, '\n').replace(/\n/g, '').split(';');
	}

	$(function() {
		markers = new google.maps.MVCArray();

		var geolocation = h5.api.geo;
		var geolocationDev = h5.dev.api.geo;
		var googleEv = google.maps.event;
		var defaultPos = createLatLng();
		var map = createMap($('#gmap').get(0), {
			zoom: 14,
			center: defaultPos,
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			disableDefaultUI: true
		});
		googleEv.trigger(map, 'resize');

		$('#mapping')
				.click(
						function(ev) {
							clearMarker();
							if (promise && promise.unwatch)
								promise.unwatch();

							var codes = readLine($('#dummycode').val());
							var len = codes.length;
							if (len === 0 || codes[0] === "") {
								return;
							}

							for ( var i = 0; len > i; i++) {
								if (codes[i] === "") {
									continue;
								}

								eval(codes[i].toString());
							}

							if ($.type(geolocationDev.dummyPositions) !== 'array'
									|| geolocationDev.dummyPositions.length === 1) {
								geolocation
										.getCurrentPosition()
										.done(
												function(pos) {
													var latLng = new google.maps.LatLng(
															pos.coords.latitude,
															pos.coords.longitude);
													var markerUrl = 'http://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=C|FF0000|000000';
													map.panTo(latLng);
													map.setZoom(16);
													markers.push(new google.maps.Marker({
														map: map,
														position: latLng,
														draggable: false,
														icon: {
															url: markerUrl
														},
														animation: google.maps.Animation.DROP
													}));
												});
							} else {
								var count = 0;
								promise = geolocation
										.watchPosition()
										.progress(
												function(pos) {
													var latLng = new google.maps.LatLng(
															pos.coords.latitude,
															pos.coords.longitude);
													var markerUrl = 'http://chart.googleapis.com/chart?chst=d_map_pin_letter&chld='
															+ (++count) + '|00FF33|000000';
													map.panTo(latLng);
													map.setZoom(16);
													markers.push(new google.maps.Marker({
														map: map,
														position: latLng,
														draggable: false,
														icon: {
															url: markerUrl
														},
														animation: google.maps.Animation.DROP
													}));
												});
							}
						});

		$('#clear').click(clearMarker);
		$('#stop').click(stopWatchPositon);
		$('#clearTextarea').click(function() {
			$('#dummycode').val('');
		});
	});
})(jQuery);
