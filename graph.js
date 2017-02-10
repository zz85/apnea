function timeline(te, x=50, y=50, pps) {
	ctx.save();
	ctx.scale(dpr, dpr);
	ctx.translate(x, y);
	ctx.font = '10px monospace';
	ctx.lineWidth = 1;
	ctx.strokeStyle = '#fff';

	const MINS = 60;
	const SECS_10 = 10;    
	// unit pixel per second eg. // 3.2
    const PPS = pps || 2;
	

	// ctx.lineCap = "round"; // butt round square
	for (let x = 0; x <= 5; x++) {
		cx = x * MINS * PPS;
		ctx.beginPath();
		ctx.moveTo(cx, -10);
		ctx.lineTo(cx, 10);
		ctx.stroke();

		// ctx.strokeText(format(x * MINS * 1000), cx, -20);
	}

	for (let x = 0; x <= 5 * 6; x++) {
		cx = x * SECS_10 * PPS;
		ctx.beginPath();
		ctx.moveTo(cx, -5);
		ctx.lineTo(cx, 5);
		ctx.stroke();

		if (x % 3 === 0) ctx.strokeText(format(x * SECS_10 * 1000, 0), cx, -20);
	}

	for (let x = 0; x <= 5 * 60; x++) {
		ctx.beginPath();
		ctx.moveTo(x * PPS, -1);
		ctx.lineTo(x * PPS, 1);
		ctx.stroke();
	}

	s = te.find(e => e.type === 'start')
	if (!s) return ctx.restore();
	s = s.time;

	ctx.lineWidth = 4;
	ctx.strokeStyle = 'red';
	ctx.fillStyle = 'red';
	te.forEach(e => {
		t = (e.time - s) / 1000 * PPS
		switch (e.type) {
			case 'contraction_on':
			ctx.beginPath();
				// ctx.arc(t, 18, 3, 0, 7)
				// ctx.fill();

				ctx.beginPath();
				ctx.moveTo(t, 18);
				break;
			case 'contraction_off':
				ctx.lineTo(t, 18);
				ctx.strokeStyle = 'red';
				ctx.stroke();


				break;
			case 'stop':
				ctx.strokeStyle = 'yellow';
				ctx.lineWidth = 2;
				ctx.beginPath();
				ctx.moveTo(0, 28)
				ctx.lineTo(t, 28);
				ctx.stroke();
		}
	})

	ctx.restore();
}