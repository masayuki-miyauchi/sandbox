(function($) {
	var googleEv = google.maps.event;

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
	 * 指定された緯度・経度から、住所を取得をします。
	 *
	 * @param {Object} latitude 緯度
	 * @param {Object} longitude 経度
	 * @param {String} callback 引数に座標を持つコールバック関数
	 */
	function getAddressByLatLng(latitude, longitude, callback) {
		if (!latitude || !longitude) {
			return null;
		}

		var geocoder = new google.maps.Geocoder();
		var latLng = new google.maps.LatLng(latitude, longitude);

		geocoder.geocode({
			'location': latLng
		}, function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				callback(results[0].formatted_address);
			} else {
				alert('位置が不正なため、住所を取得できません。');
			}
		});
	}

	/**
	 * Google Map上にメニューボタンを生成します。
	 *
	 * @param {Object} map Google Mapオブジェクト
	 * @param {String} メニュー表示位置(google.maps.ControlPositionクラスの定数を指定する)
	 */
	function GoogleMapMenu(map, controlPosition) {
		this.baseDiv = $('<div></div>');
		this.baseDiv.css('padding', '3px');
		this.baseDiv.css('background-color', '#ffffcc');
		this.baseDiv.css('border', '1px solid #000');
		this.baseDiv.css('text-align', 'center');
		this.baseDiv.css('border-radius', '5px');
		this.baseDiv.css('-moz-border-radius', '5px');
		this.baseDiv.css('-webkit-border-radius', '5px');

		map.controls[controlPosition].push(this.baseDiv[0]);
	}

	GoogleMapMenu.prototype.hideMenu = function() {
		this.baseDiv.hide();
	};

	GoogleMapMenu.prototype.showMenu = function() {
		this.baseDiv.show();
	};

	GoogleMapMenu.prototype.addNode = function(element) {
		this.baseDiv.append(element);
	};

	GoogleMapMenu.prototype.addButton = function(btnTitle, clickEventHandler) {
		var btn = $('<div></div>');
		btn.css('background-color', '#ffffff');
		btn.css('border', '1px solid #000');
		btn.css('cursor', 'pointer');
		btn.css('text-align', 'center');
		btn.css('margin', '1px');
		btn.text(btnTitle);
		this.baseDiv.append(btn);
		googleEv.addDomListener(btn[0], 'click', clickEventHandler);
	};

	GoogleMapMenu.prototype.clickButton = function(btnTitle) {
		this.baseDiv.children().each(function(idx, elem) {
			var $elem = $(this);
			if ($elem.text() == btnTitle) {
				googleEv.trigger(this, 'click');
				return;
			}
		});
	};

	GoogleMapMenu.prototype.showButton = function(btnTitle) {
		this.baseDiv.children().each(function(idx, elem) {
			var $elem = $(this);
			if ($elem.text() == btnTitle) {
				$elem.show();
				return;
			}
		});
	};

	GoogleMapMenu.prototype.hideButton = function(btnTitle) {
		this.baseDiv.children().each(function(idx, elem) {
			var $elem = $(this);
			if ($elem.text() == btnTitle) {
				$elem.hide();
				return;
			}
		});
	};

	GoogleMapMenu.prototype.removeButton = function(btnTitle) {
		this.baseDiv.children().each(function(idx, elem) {
			var $elem = $(this);
			if ($elem.text() == btnTitle) {
				googleEv.clearListeners(this, 'click');
				elem.remove();
				return;
			}
		});
	};

	GoogleMapMenu.prototype.remove = function() {
		this.baseDiv.children().each(function(idx, elem) {
			var $elem = $(this);
			googleEv.clearListeners(this, 'click');
			$elem.remove();
		});

		this.baseDiv.remove();
	};

	/**
	 * navigator.geolocation のデバッグを支援するクラス
	 */
	function GeoLocationHelper() {
	//
	}

	GeoLocationHelper.prototype = {
		/**
		 * navigator.geolocation.getCurrentPosition デバッグ支援用 地図で選択した位置または入力された住所から、緯度と経度を取得します。
		 *
		 * @param successCallback 成功時コールバック関数(引数に座標オブジェクトを持つ)
		 */
		init: function(baseDiv, successCallback) {

			var width = 700;
			var height = 650;

			var mainWindow = $('<div></div>');
			mainWindow.css('left', 10);
			mainWindow.css('top', 100);
			mainWindow.css('width', width);

			var ul = $('<ul></ul>');
			ul.css('width', '100%');
			ul.css('margin', '0px');
			ul.css('padding', '0px');

			var li1 = $('<li></li>');
			li1.text('getCurrentPosition');
			li1.appendTo(ul);

			var li2 = $('<li></li>');
			li2.text('watchPosition');
			li2.appendTo(ul);

			var ulChild = ul.children('li');
			ulChild.hover(function() {
				$(this).css('background-color', 'lightskyblue');
			}, function() {
				$(this).css('background-color', 'white');
			});

			ulChild.css('display', 'inline-block');
			ulChild.css('border-top-left-radius', '5px');
			ulChild.css('border-top-left-radius', '5px');
			ulChild.css('border-top-right-radius', '5px');
			ulChild.css('border-top-right-radius', '5px');
			ulChild.css('-ms-border-top-left-radius', '5px');
			ulChild.css('-ms-border-top-left-radius', '5px');
			ulChild.css('-ms-border-top-right-radius', '5px');
			ulChild.css('-ms-border-top-right-radius', '5px');
			ulChild.css('-moz-border-top-left-radius', '5px');
			ulChild.css('-moz-border-top-left-radius', '5px');
			ulChild.css('-moz-border-top-right-radius', '5px');
			ulChild.css('-moz-border-top-right-radius', '5px');
			ulChild.css('-webkit-border-top-left-radius', '5px');
			ulChild.css('-webkit-border-top-left-radius', '5px');
			ulChild.css('-webkit-border-top-right-radius', '5px');
			ulChild.css('-webkit-border-top-right-radius', '5px');
			ulChild.css('border-width', '1px 1px 0px 1px');
			ulChild.css('border-style', 'solid');
			ulChild.css('border-color', '#ccc');
			ulChild.css('float', 'left');
			ulChild.css('padding', '3px 10px 3px 10px');
			ulChild.css('cursor', 'pointer');
			ul.appendTo(mainWindow);

			// ------------------- getCurrentPosition(地図) -----------------------

			var parentDiv = $("<div></div>");
			parentDiv.attr('class', 'tabView');
			parentDiv.appendTo(mainWindow);

			var mapBaseDiv = $('<div></div>');
			mapBaseDiv.css('height', height - 100);
			mapBaseDiv.css('width', '100%');
			mapBaseDiv.css('border-width', '1px 1px 1px 1px');
			mapBaseDiv.css('border-style', 'solid');
			mapBaseDiv.css('border-color', '#ccc');
			mapBaseDiv.css('overflow', 'hidden');
			mapBaseDiv.appendTo(parentDiv);

			var original = mapBaseDiv.get(0);
			var defaultPos = createLatLng();
			var map = createMap(original, {
				zoom: 14,
				center: defaultPos,
				mapTypeId: google.maps.MapTypeId.ROADMAP,
				disableDefaultUI: true
			});

			li1.bind('click', $.proxy(function() {
				var that = $(this);
				that.parent().children('.tabView').hide();
				that.show();
				googleEv.trigger(map, 'resize');
				$("#list").triggerHandler('tabChanged', "currentPosition");
			}, parentDiv.get(0)));

			var marker = null;
			var markerUrl = 'http://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=P|FF0000|000000';

			googleEv.addListener(map, 'click', function(ev) {
				if (marker !== null) {
					googleEv.trigger(marker, 'click');
				}

				marker = new google.maps.Marker({
					map: map,
					position: ev.latLng,
					draggable: true,
					icon: {
						url: markerUrl
					}
				});

				var loc = marker.getPosition();
				successCallback({
					latitude: loc.lat(),
					longitude: loc.lng()
				});

				var handler = googleEv.addListener(marker, 'dragend', function() {
					var currentLoc = marker.getPosition();
					successCallback({
						latitude: currentLoc.lat(),
						longitude: currentLoc.lng()
					});
				});

				googleEv.addListenerOnce(marker, 'click', function() {
					marker.setMap(null);
					marker = null;
					googleEv.removeListener(handler);
				});
			});

			// ------------------- getCurrentPosition(住所) -----------------------

			var addressDiv = $('<div></div>');
			addressDiv.css('height', 100);
			addressDiv.css('width', '100%');
			addressDiv.css('border-width', '0px 1px 1px 1px');
			addressDiv.css('border-style', 'solid');
			addressDiv.css('border-color', '#ccc');
			addressDiv.css('overflow', 'hidden');
			addressDiv.appendTo(parentDiv);

			var addressInner = $('<div></div>');
			addressInner.css('padding', '20px');
			addressInner.appendTo(addressDiv);

			var title = $('<label></label>');
			title.text('【住所から場所を取得】住所を入力してください。');
			title.appendTo(addressInner);

			var inputAddress = $('<input/>');
			inputAddress.attr('type', 'text');
			inputAddress.width('100%');
			inputAddress.appendTo(addressInner);

			addressInner.append('</br>');

			var okBtn = $('<input/>');
			okBtn.attr('type', 'button');
			okBtn.val('座標を取得');
			okBtn.css('float', 'right');
			okBtn.appendTo(addressInner);

			okBtn.bind('click', $.proxy(function() {
				var address = inputAddress.val();

				if (address === '') {
					return false;
				}

				this.getLatLngByAddress(address, function(loc) {
					map.panTo(createLatLng(loc.lat(), loc.lng()));
					googleEv.trigger(map, 'click', {latLng: loc});
				});

				return false;
			}, this));

			// ------------------------- watchposition ------------------------

			var dummyPositions = null;
			var parentDiv2 = $("<div></div>");
			parentDiv2.attr('class', 'tabView');
			parentDiv2.appendTo(mainWindow);

			// --------------------- watchPosition下段 -----------------------

			var watchIntervalDiv = $('<div></div>');
			watchIntervalDiv.css('height', 100);
			watchIntervalDiv.css('width', '100%');
			watchIntervalDiv.css('border-width', '0px 1px 1px 1px');
			watchIntervalDiv.css('border-style', 'solid');
			watchIntervalDiv.css('border-color', '#ccc');
			watchIntervalDiv.css('overflow', 'hidden');
			watchIntervalDiv.appendTo(parentDiv2);

			var addressDiv2 = $('<div></div>');
			addressDiv2.css('padding', '20px');
			addressDiv2.appendTo(watchIntervalDiv);

			var inputIntervalTitle = $('<label></label>');
			inputIntervalTitle.text('【ウォッチ間隔】');
			inputIntervalTitle.appendTo(addressDiv2);

			var inputInterval = $('<input/>');
			inputInterval.attr('type', 'number');
			inputInterval.width('100%');
			inputInterval.val('1000');
			inputInterval.appendTo(addressDiv2);

			// --------------------- watchPosition上段 -----------------------

			var mapBaseDiv2 = $('<div></div>');
			mapBaseDiv2.css('height', height - 100);
			mapBaseDiv2.css('width', '100%');
			mapBaseDiv2.css('border-width', '1px 1px 1px 1px');
			mapBaseDiv2.css('border-style', 'solid');
			mapBaseDiv2.css('border-color', '#ccc');
			mapBaseDiv2.prependTo(parentDiv2);

			var original2 = mapBaseDiv2.get(0);
			var defaultPos2 = createLatLng();
			var map2 = createMap(original2, {
				zoom: 14,
				center: defaultPos2,
				mapTypeId: google.maps.MapTypeId.ROADMAP,
				disableDefaultUI: true
			});

			li2.bind('click', $.proxy(function() {
				$(this).parent().children('.tabView').hide();
				$(this).show();
				googleEv.trigger(map2, 'resize');
				$("#list").triggerHandler('tabChanged', "watchPosition");
			}, parentDiv2.get(0)));

			var startPoint = null;
			var goalPoint = null;
			var wayPoint = new google.maps.MVCArray();
			var route = null;
			var baseMenu = new GoogleMapMenu(map2, google.maps.ControlPosition.LEFT);
			var baseMenu2 = new GoogleMapMenu(map2, google.maps.ControlPosition.RIGHT);

			// ---------------- watchPosition 左上メニュー ----------------

			baseMenu.addButton('マーカーをクリア', function() {
				if (route !== null) {
					route.setMap(null);
					baseMenu2.hideMenu();
					route = null;
				}

				wayPoint.forEach(function(elem, idx) {
					if (elem == null) {
						return true;
					}

					googleEv.clearListeners(elem, 'click');
					elem.setMap(null);
				});

				for ( var i = 0, len = wayPoint.getLength(); i < len; i++) {
					wayPoint.removeAt(i);
				}

				if (startPoint) {
					googleEv.clearListeners(startPoint, 'click');
					startPoint.setMap(null);
					startPoint = null;
				}

				if (goalPoint) {
					googleEv.clearListeners(goalPoint, 'click');
					goalPoint.setMap(null);
					goalPoint = null;
				}
			});

			var markerUrlS = 'http://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=S|00FF33|000000';
			var markerUrlG = 'http://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=G|FFFF00|000000';
			var markerUrlP = 'http://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=P|FF0000|000000';

			googleEv.addListener(map2, 'click', function(ev) {
				var loc = ev.latLng;

				if (!startPoint) {
					startPoint = new google.maps.Marker({
						map: map2,
						position: loc,
						draggable: true,
						icon: {
							url: markerUrlS
						}
					});

					googleEv.addListener(startPoint, 'click', function() {
						startPoint.setMap(null);
						googleEv.clearListeners(startPoint, 'click');
						startPoint = null;
					});
				} else if (!goalPoint) {
					goalPoint = new google.maps.Marker({
						map: map2,
						position: loc,
						draggable: true,
						icon: {
							url: markerUrlG
						}
					});

					googleEv.addListener(goalPoint, 'click', function() {
						goalPoint.setMap(null);
						googleEv.clearListeners(goalPoint, 'click');
						goalPoint = null;
					});
				} else {
					var marker = new google.maps.Marker({
						map: map2,
						position: loc,
						draggable: true,
						icon: {
							url: markerUrlP
						}
					});
					wayPoint.push(marker);

					googleEv.addListener(marker, 'click', function() {
						var removeMarkerPos = marker.getPosition();
						marker.setMap(null);

						for ( var i = 0, len = wayPoint.getLength(); i < len; i++) {
							var elem = wayPoint.getAt(i);

							if (elem == null) {
								continue;
							}

							var pos = elem.getPosition();
							if (pos.equals(removeMarkerPos)) {
								wayPoint.removeAt(i);
								break;
							}
						}
					});
				}
			});

			var isMakeRoute = false;
			baseMenu.addButton('ルートを作成', function() {
				var time = inputInterval.val();
				if (time === '' || time.match(/[^0-9]+/) != null) {
					return;
				}

				if (route || isMakeRoute || !startPoint || !goalPoint) {
					return;
				}

				isMakeRoute = true;

				var points = [];

				for ( var i = 0, len = wayPoint.getLength(); i < len; i++) {
					points.push({
						location: wayPoint.getAt(i).getPosition()
					});
				}

				new google.maps.DirectionsService().route({
					origin: startPoint.getPosition(),
					destination: goalPoint.getPosition(),
					waypoints: points,
					travelMode: google.maps.DirectionsTravelMode.WALKING
				}, function(result, status) {
					isMakeRoute = false;

					if (status == google.maps.DirectionsStatus.OK) {
						baseMenu.clickButton('マーカーをクリア');
						baseMenu.showButton('ルートをクリア');
						baseMenu2.showMenu();

						route = new google.maps.DirectionsRenderer({
							map: map2
						});
						route.setDirections(result);

						var overViewsPath = result.routes[0].overview_path;
						dummyPositions = [];

						for ( var i = 0, len = overViewsPath.length; i < len; i++) {
							var loc = overViewsPath[i];
							dummyPositions.push({
								latitude: loc.lat(),
								longitude: loc.lng()
							});
						}
						successCallback(dummyPositions, time);
					}
				});
			});

			mainWindow.appendTo(baseDiv);
			li1.trigger('click');
		},

		/**
		 * 指定された緯度・経度から、GoogleMapを作成します。
		 *
		 * @param {Object} elem マップを追加する要素
		 * @param {String} lat 緯度
		 * @param {String} lng 経度
		 */
		createMapByLatLan: function(elem, lat, lng) {
			if (!elem) {
				return;
			}

			return createMap(elem, {
				zoom: 14,
				center: createLatLng(lat, lng),
				mapTypeId: google.maps.MapTypeId.ROADMAP
			});
		},

		/**
		 * 指定された住所から、緯度・経度を取得をします。
		 *
		 * @param {String} address 住所
		 * @param {String} callback 引数に座標を持つコールバック関数
		 */
		getLatLngByAddress: function(address, callback) {
			if (!address) {
				return null;
			}

			var geocoder = new google.maps.Geocoder();
			geocoder.geocode({
				'address': address
			}, function(results, status) {
				if (status == google.maps.GeocoderStatus.OK) {
					callback(results[0].geometry.location);
				} else {
					alert('住所が特定できないため、座標を取得できません。');
				}
			});
		}
	};

	function createTitle(isWatchPosition, data) {
		var df = $.Deferred();
		var firstLatLng = null;
		var title = null;

		if (isWatchPosition) {
			firstLatLng = data[0];
			var lastLatLng = data[data.length - 1];

			getAddressByLatLng(firstLatLng.latitude, firstLatLng.longitude, function(address) {
				title = 'A:' + address;
				title += ' ～ ';
				getAddressByLatLng(lastLatLng.latitude, lastLatLng.longitude, function(address2) {
					title += 'B:' + address2;
					df.resolve(title);
				});
			});
		} else {
			firstLatLng = data;
			getAddressByLatLng(firstLatLng.latitude, firstLatLng.longitude, function(address) {
				title = address;
				df.resolve(title);
			});
		}

		return df.promise();
	}

	$(function() {
		function addList(data, time) {
			// ダミーコード生成
			var createDummyCodeFunc =(function(dummyData, intervalTime) {
				return function() {
					var code = "";
					if (time) {
						code += 'h5.dev.api.geo.watchIntervalTime = ' + time
								+ ';\nh5.dev.api.geo.dummyPositions = [';

						for ( var i = 0, len = dummyData.length; i < len; i++) {
							code += h5.u.str.format('{\n\tlatitude:{0},\n\tlongitude:{1}\n},\n',
									dummyData[i].latitude, dummyData[i].longitude);
						}
						code = code.substring(0, code.length - 2) + '];';
					} else {
						code += h5.u.str
								.format(
										'h5.dev.api.geo.dummyPositions = {\n\tlatitude:{0},\n\tlongitude:{1}\n};\n',
										dummyData.latitude, dummyData.longitude);
					}

					var elem = $('#dummyData');
					elem.fadeOut('fast', function() {
						elem.fadeIn('fast', function() {
							elem.text(code);
							elem.select();
						});
					});

					var parentRow = $(this).closest('tr');
					parentRow.siblings().children('td:not(:first-child)').css('background-color',
							'white');
					parentRow.children('td:not(:first)').css('background-color', 'lemonchiffon');
				};
			})(data, time);

			createTitle(time !== undefined, data)
					.then(
							function(title) {
								var list = $("#list");
								var row = $('<tr></tr>');
								row.append('<td></td><td></td><td></td>').hide();
								row.children('td').css('border-width', '1px').css('border-style',
										'solid');
								list.append(row);

								var button1 = $('<input>').attr('type', 'button').attr('name',
										'createCode').val('コードを生成').click(createDummyCodeFunc);

								var no = row.children('td:eq(0)');
								no.css('background-color', time == null ? 'darksalmon'
										: 'mediumturquoise');
								no.text($('#list tr:not(:hidden)').length + 1);

								row.children('td:eq(1)').text(title);
								row.children('td:eq(2)').append(button1);
								row.fadeIn('normal');
								row.addClass(time == null ? 'currentPosition' : 'watchPosition');

								list.parent().scrollTop(list.height());
								button1.click();
							});
		}

		new GeoLocationHelper().init($("#gmap"), function(resultData, intervalTime) {
			addList(resultData, intervalTime);
		});

		$("#list").bind('tabChanged', function(ev, tabName) {
			var that = $(ev.target);
			var rows = that.find('tr');

			if (rows.length === 0) {
				return;
			}

			rows.filter(':not(.' + tabName + ')').hide();
			$('#dummyData').text('');

			var dispRow = rows.filter('.' + tabName);

			if (dispRow.length > 0) {
				dispRow.show();
				dispRow.eq(dispRow.length - 1).find('input[name="createCode"]').click();
				that.parent().scrollTop(that.height());
			}
		});
	});
})(jQuery);