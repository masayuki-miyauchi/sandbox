$(function() {
	var ball = document.getElementById("ball"),ballw = $(ball).width(),width = document.documentElement.clientWidth,height = document.documentElement.clientHeight,speed = 0.1,bounce = 0.98,x = 0,y = 0,ax = 0,ay = 0,vx = 0,vy = 0,elemGx = $('#valGx'),elemGy = $('#valGy'),elemGz = $('#valGz'),elemAx = $('#valAx'),elemAy = $('#valAy'),elemAz = $('#valAz'),elemRx = $('#valRx'),elemRy = $('#valRy'),elemRz = $('#valRz');

	window.addEventListener('devicemotion', function(ev) {
		var ag = ev.accelerationIncludingGravity;
		var gx = ag.x;
		var gy = ag.y;
		var gz = ag.z;

		ax = gx * speed;
		ay = -gy * speed;

		elemGx.text('accelerationIncludingGravity X: ' + gx);
		elemGy.text('accelerationIncludingGravity Y: ' + gy);
		elemGz.text('accelerationIncludingGravity Z: ' + gz);

		var a = ev.rotationRate;
		var alx = a.alpha;
		var aly = a.beta;
		var alz = a.gamma;

		elemAx.text('rotationRate alpha: ' + alx);
		elemAy.text('rotationRate beta: ' + aly);
		elemAz.text('rotationRate gamma: ' + alz);

		var b = ev.acceleration;
		var arx = b.x;
		var ary = b.y;
		var arz = b.z;

		// if (arx >= 4) {
		// console.log("arx:"+ arx);
		// }
		//
		// if (ary >= 4) {
		// console.log("ary: "+ ary);
		// }
		//
		// if (arz >= 4) {
		// console.log("arz: "+ arz);
		// }

		elemRx.text('acceleration X: ' + arx);
		elemRy.text('acceleration Y: ' + ary);
		elemRz.text('acceleration Z: ' + arz);
	});

	setInterval(function() {
		vx *= bounce;
		vy *= bounce;
		vx += ax;
		vy += ay;
		x += vx;
		y += vy;

		if (x > width - ballw) {
			x = width - ballw;
			vx *= bounce;
		} else if (x < 0) {
			x = 0;
			vx *= -(bounce);
		}

		if (y > height - ballw) {
			y = height - ballw;
			vy *= -(bounce);
		} else if (y < 0) {
			y = 0;
			vy *= -(bounce);
		}

		ball.style.webkitTransform = 'translate3d(' + x + 'px,' + y + 'px, 0)';
	});
});