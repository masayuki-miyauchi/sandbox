$(function(){
	// 矢印の描画処理
	function drawSvgArrow(){

		var centerImg = $('#contents #graph svg image.center_node')[0];
		var $nodeImg = $('#contents #graph svg image.node');
		var $svg =$('#contents #graph svg');
		var svgLeft = $svg.position().left;
		var svgTop = $svg.position().top;
		var $g =$svg.find('g');
		var tmp;
		var scale = 1 || ((tmp = $g.attr('transform')) && tmp.match(/scale\((.*?)\)/) && RegExp.$1);
		var centerWidth = parseInt(centerImg.getAttribute('width'));
		var centerHeight = parseInt(centerImg.getAttribute('height'));
		var cx1 = parseInt(centerImg.getAttribute('x')) + centerWidth/2;
		var cy1 = parseInt(centerImg.getAttribute('y')) + centerHeight/2;
		$nodeImg.each(function(){
			var x1,y1,x2,y2;
			var cx2,cy2;
			var nodeWidth = parseInt(this.getAttribute('width'));
			var nodeHeight = parseInt(this.getAttribute('height'));
			cx2 = parseInt(this.getAttribute('x')) + nodeWidth/2;
			cy2 = parseInt(this.getAttribute('y')) + nodeHeight/2;


			// 矢印が画像と重ならないように計算する
			var cos = (cx2-cx1)/Math.sqrt((cx1-cx2)*(cx1-cx2)+(cy1-cy2)*(cy1-cy2));
			var sin = Math.sqrt(1-cos*cos);
			sin *= cy2 < cy1? 1: -1;

			if(Math.abs((cx2-cx1)/(cy2-cy1)) > centerWidth/centerHeight){
				x1=(cx1 + (cos<0?-1:1)*centerWidth/2);
			}else{
				x1 = cx1 - (sin<0?1:-1)*(centerHeight/2 * cos/sin);
			}

			if(Math.abs((cx2-cx1)/(cy2-cy1)) > centerWidth/centerHeight){
				y1 = cy1 + (sin<0?1:-1)*Math.abs(centerWidth/2 * sin/cos);
			} else{
				y1 = cy1 + (sin<0?1:-1)*centerHeight/2;
			}

			if(Math.abs((cx1-cx2)/(cy1-cy2)) > centerWidth/centerHeight){
				x2=(cx2 - (cos<0?-1:1)*centerWidth/2);
			}else{
				x2 = cx2 + (sin<0?1:-1)*(centerHeight/2 * cos/sin);
			}

			if(Math.abs((cx1-cx2)/(cy1-cy2)) > centerWidth/centerHeight){
				y2 = cy2 - (sin<0?1:-1)*Math.abs(centerWidth/2 * sin/cos);
			} else{
				y2 = cy2 - (sin<0?1:-1)*centerHeight/2;
			}

			var th = Math.acos(cos);
			 th *= cy2 > cy1? 1: -1;

			var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
			line.setAttribute('x1',x1);
			line.setAttribute('y1',y1);
			line.setAttribute('x2',x2);
			line.setAttribute('y2',y2);
			$g.append(line);

			// 矢尻の描画
			var arrow = document.createElementNS('http://www.w3.org/2000/svg', 'g');
			var head1 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
			head1.setAttribute('x1',0);
			head1.setAttribute('y1',1);
			head1.setAttribute('x2',-15);
			head1.setAttribute('y2',0-10);
			arrow.appendChild(head1);
			var head2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
			head2.setAttribute('x1',0);
			head2.setAttribute('y1',-1);
			head2.setAttribute('x2',-15);
			head2.setAttribute('y2',+10);
			arrow.appendChild(head2);
			arrow.setAttribute('transform', 'translate('+ x2 + ' ' + y2 + ') rotate('+ th*180/Math.PI+')');
			$g.append(arrow);

		});
	}
	drawSvgArrow();
});