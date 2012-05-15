// ロジッククラスの定義
function SearchLogic() {
// contructor
}

SearchLogic.prototype = {

	__name: 'SearchLogic',

	getCurrent: function() {
		var current = new Date();
		return {
			year: current.getFullYear(),
			month: current.getMonth() + 1,
			date: current.getDate()
		};
	},

	getTomorrow: function(year, month, date) {
		var tomorrow = new Date(year, month - 1, date);
		tomorrow.setDate(tomorrow.getDate() + 1);
		return {
			year: tomorrow.getFullYear(),
			month: tomorrow.getMonth() + 1,
			date: tomorrow.getDate()
		};
	},

	getYear: function() {
		var current = new Date();
		var years = [];
		years.push(current.getFullYear());
		years.push(current.getFullYear() + 1);
		years.push(current.getFullYear() + 2);
		return years;
	},

	getMonth: function() {
		var months = [];
		for ( var i = 1; i < 13; i++) {
			months.push(i);
		}
		return months;
	},

	getDate: function(year, month) {
		var dates = [];
		var count = new Date(year, month, 0).getDate();
		for ( var i = 1; i < count + 1; i++) {
			dates.push(i);
		}
		return dates;
	},

	checkDate: function(from, to) {
		var fromDate = new Date(from.year, from.month, from.date);
		var toDate = new Date(to.year, to.month, to.date);
		var diff = toDate - fromDate;
		if (diff < 0) {
			return '開始日付、終了日付が不正です。';
		}
	},

	getTotalCount: function(parameter) {
		var dfd = this.deferred();
		setTimeout(function() {
			// データ作成
			var count = Math.floor(Math.random() * 400);
			// 処理終了
			dfd.resolve(count);
		}, 500);
		return dfd.promise();
	},

	search: function(start, end, parameter) {
		var that = this;
		var dfd = this.deferred();

		setTimeout(function() {

			// データ作成
			var count = end - start;
			var data = that._createResults(count);
			for ( var i = 0, len = data.length; i < len; i++) {
				data[i].price = that.addFigure(data[i].price);
			}
			// 処理終了
			dfd.resolve(data);
		}, 1500);
		return dfd.promise();
	},

	addFigure: function(price) {
		var num = new String(price).replace(/,/g, "");
		while (num != (num = num.replace(/^(-?\d+)(\d{3})/, "$1,$2")))
			;
		return num;
	},

	_createResults: function(resultCount) {

		var PREFIX = 'hotelImage/imgr_200_';
		var EXTENSION = '.jpg';

		var hotels = [{
			name: '全日空ホテル',
			desc: '「快適な朝」をお迎え下さい…「和洋バイキング」北海道の旬をお愉しみ下さいませ。「和定食」四季折々の景観を25階から',
			url: 'http://travel.rakuten.co.jp/HOTEL/169/169.html',
			price: 4400,
			imageUrl: 'ana'
		}, {
			name: 'アパホテル',
			desc: 'リーズナブルな価格、多彩なサービスで大人気！ビジネス・旅行に最適。コンビニ目の前。',
			url: 'http://travel.rakuten.co.jp/HOTEL/16008/16008.html',
			price: 3500,
			imageUrl: 'apa'
		}, {
			name: '札幌アスペンホテル',
			desc: '札幌駅北口から徒歩２分。四季の表情が美しい北大キャンパス・ＪＲタワースクエアなど人気スポットも近く便利なロケーション! ',
			url: 'http://travel.rakuten.co.jp/HOTEL/625/625.html',
			price: 4000,
			imageUrl: 'aspen'
		}, {
			name: 'センチュリーロイヤルホテル',
			desc: 'ＪＲ・地下鉄の「札幌駅」から徒歩2分の好立地、地下通路でも直結なので札幌の拠点に最適。全室ネット接続無料。',
			url: 'http://travel.rakuten.co.jp/HOTEL/559/559.html',
			price: 2500,
			imageUrl: 'century'
		}, {
			name: '札幌クラッセホテル',
			desc: '札幌中心部、大通公園の近く、隠れ家的な、優しいホテルです。',
			url: 'http://travel.rakuten.co.jp/HOTEL/14523/14523.html',
			price: 2300,
			imageUrl: 'crasse'
		}, {
			name: '石狩の湯　ドーミーイン札幌',
			desc: '繁華街すすきのも徒歩圏内。無料の男女別大浴場は、本館・ＡＮＮＥＸ館と共に利用でき、プチ湯巡りをお楽しみ頂けます♪',
			url: 'http://travel.rakuten.co.jp/HOTEL/14019/14019.html',
			price: 3500,
			imageUrl: 'dormy'
		}, {
			name: 'ベストウェスタン　ホテルフィーノ札幌（旧　ＨＯＴＥＬ　Ｆｉｎｏ　ＳＡＰＰＯＲＯ）',
			desc: '★札幌駅北口から徒歩2分★北海道大学まで徒歩2分★駅近なのに静かな環境、五感でくつろぐ上質なホテルライフを提供します♪ ',
			url: 'http://travel.rakuten.co.jp/HOTEL/68288/68288.html',
			price: 3300,
			imageUrl: 'fino'
		}, {
			name: 'ホテル札幌ガーデンパレス',
			desc: '道庁赤レンガの南側。JR札幌駅徒歩約7分･地下鉄大通駅徒歩約5分！ビジネスや観光の拠点として最適立地！コンビニ徒歩1分！',
			url: 'http://travel.rakuten.co.jp/HOTEL/8908/8908.html',
			price: 3900,
			imageUrl: 'garden'
		}, {
			name: '札幌グランドホテル',
			desc: '「札幌駅前通地下歩行空間」8番出口から徒歩5秒/ビジネス・観光の拠点に便利な好立地。老舗ホテルだからサービスも安心',
			url: 'http://travel.rakuten.co.jp/HOTEL/762/762.html',
			price: 4000,
			imageUrl: 'grand'
		}, {
			name: 'ホテル法華クラブ札幌',
			desc: '★大浴場完備★全室地デジ対応テレビ設置★コンビニ徒歩1分★全室ＬＡＮケーブル完備★コインランドリー完備★ ',
			url: 'http://travel.rakuten.co.jp/HOTEL/127/127.html',
			price: 2700,
			imageUrl: 'hokke'
		}, {
			name: 'ＪＲイン札幌',
			desc: '【楽天トラベルアワード金賞受賞】ＪＲ札幌駅から徒歩２分【パセオ西側出口より】！ビジネスに観光にアクセス抜群の好立地★',
			url: 'http://travel.rakuten.co.jp/HOTEL/72781/72781.html',
			price: 3150,
			imageUrl: 'jrinn'
		}, {
			name: 'ＪＲタワーホテル日航札幌',
			desc: '札幌駅と結ばれた便利さとリゾートのくつろぎ　美しい眺望に抱かれて、やすらぎと感動の時を',
			url: 'http://travel.rakuten.co.jp/HOTEL/76941/76941.html',
			price: 11000,
			imageUrl: 'jrtower'
		}, {
			name: 'ホテルモントレ札幌',
			desc: '全館英国風に統一。欧州文化にはぐくまれた伝統や生活様式をテーマに、上質なくつろぎでお迎えするホテルです。',
			url: 'http://travel.rakuten.co.jp/HOTEL/1131/1131.html',
			price: 3600,
			imageUrl: 'montley'
		}, {
			name: 'ビジネスイン　ノルテII',
			desc: '地下鉄・北大近く、ビジネス・観光に最適',
			url: 'http://travel.rakuten.co.jp/HOTEL/15493/15493.html',
			price: 2450,
			imageUrl: 'norte'
		}, {
			name: 'ホテルオークラ札幌',
			desc: '8月も！【月火水】限定★連泊すると…なんと火曜日が半額→1名2,250円～！＝空室残りわずか、お急ぎください＝ ',
			url: 'http://travel.rakuten.co.jp/HOTEL/18390/18390.html',
			price: 3650,
			imageUrl: 'okura'
		}, {
			name: 'ニューオータニイン札幌（旧　ホテルニューオータニ札幌） ',
			desc: '札幌駅・大通公園・時計台は徒歩圏内。◆注目◆⇒【添寝（ベッド不要）のお子様12才迄無料（大人の人数で御予約下さい）】 ',
			url: 'http://travel.rakuten.co.jp/HOTEL/163/163.html',
			price: 3000,
			imageUrl: 'otani'
		}, {
			name: '札幌プリンスホテル',
			desc: '札幌市営地下鉄東西線西11丁目駅より徒歩2分。28階建て、札幌の夜景が楽しめる円柱形の白いランドマークタワー ',
			url: 'http://travel.rakuten.co.jp/HOTEL/9515/9515.html',
			price: 3300,
			imageUrl: 'prince'
		}, {
			name: 'Ｒ＆Ｂホテル札幌北３西２',
			desc: '☆あつあつ焼きたてパンの無料サービス付き☆新千歳空港からJR札幌駅まで電車で乗り換えなし約３５分（＾０＾）/ ',
			url: 'http://travel.rakuten.co.jp/HOTEL/18175/18175.html',
			price: 3000,
			imageUrl: 'rb'
		}, {
			name: 'リッチモンドホテル札幌大通',
			desc: '宿泊客満足度NO.1受賞★大通すすきの徒歩3分。明るい照明・広デスク・広バスタブ◎快適設備やアメニティも人気の秘密。 ',
			url: 'http://travel.rakuten.co.jp/HOTEL/10888/10888.html',
			price: 2950,
			imageUrl: 'richmond'
		}, {
			name: 'ロイトン札幌',
			desc: '学会や大型コンベンション、最新スタイルのブライダルにも対応可能。ここにはインテリジェンスと人の温かさが共存しています。',
			url: 'http://travel.rakuten.co.jp/HOTEL/849/849.html',
			price: 3500,
			imageUrl: 'royton'
		}, {
			name: 'シェラトンホテル札幌',
			desc: 'シェラトンならではのホスピタリティーが訪れる全ての方を深い安らぎで包み込みます。 ',
			url: 'http://travel.rakuten.co.jp/HOTEL/901/901.html',
			price: 4500,
			imageUrl: 'sheraton'
		}, {
			name: 'ホテルサンルート札幌',
			desc: '国内外のチェーンのホテル。ＪＲ札幌駅北口より徒歩約３分。新千歳空港よりＪＲ利用で約４０分。ビジネスや観光にも便利。',
			url: 'http://travel.rakuten.co.jp/HOTEL/11019/11019.html',
			price: 2700,
			imageUrl: 'sunroute'
		}];

		for ( var i = 0; i < hotels.length; i++) {
			hotels[i].imageUrl = PREFIX + hotels[i].imageUrl + EXTENSION;
		}

		var results = [];

		for ( var j = 0; j < resultCount; j++) {
			var index = parseInt(hotels.length * Math.random());
			results.push(hotels[index]);
		}

		return results;
	}
};