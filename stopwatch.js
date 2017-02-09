
started = -1;
marker = -1;
currentReps = 0;

events = [];
mode = 'hold';

statusLabel = document.getElementById('statusLabel');

initCanvas();
setInterval(interval, 15);

document.addEventListener('mousedown', down);
document.addEventListener('mouseup', up);
document.addEventListener('touchstart', down);
document.addEventListener('touchend', up)
document.body.addEventListener('touchmove', function(e) { e.preventDefault(); });
window.addEventListener('resize', resize);

function down(e) {
	if (e.target instanceof HTMLButtonElement) return;
	contraction_down();
}

function up(e) {
	if (e.target instanceof HTMLButtonElement) return;
	contraction_up();
}

function resize() {
	const smaller = Math.min(window.innerWidth, window.innerHeight);

	dpr = window.devicePixelRatio;
	canvas.width = smaller * dpr;
	canvas.height = smaller * dpr;

	canvas.style.width = smaller + 'px';
	canvas.style.height = smaller + 'px';
}

function initCanvas() {
	canvas = document.createElement('canvas');
	canvas_container.appendChild(canvas);
	canvas.width = 800;
	canvas.height = 800;

	resize();

	ctx = canvas.getContext('2d');
}


const keydowns = {};
document.addEventListener('keydown', onkeydown);
document.addEventListener('keyup', onkeyup);
function onkeydown(e) {
	if (e.key !== ' ') return;
	if (keydowns[e.key]) return;
	keydowns[e.key] = 1;
	// emit event
	contraction_down();
}

function contraction_down() {
	if (started < 0) return;
	events.push({
		type: 'contraction_start',
		time: Date.now()
	});
}

function contraction_up() {
	if (started < 0) return;
	events.push({
		type: 'contraction_stop',
		time: Date.now()
	});
}

function toggle() {
	if (started > 0) {
		stop();
	}
	else {
		start();
	}

	toggleButton.blur();
}

function onkeyup(e) {
	if (e.key === 'Enter') {
		toggle();
	}

	if (e.key !== ' ') return;
	keydowns[e.key] = 0;
	// emit event
	contraction_up();
}


function start() {
	// TODO add count down
	started = Date.now();
	ending = started;
	events.push({
		type: 'started',
		time: started
	});

	instructions.style.display = 'none';
	toggleButton.innerHTML = 'Stop';
}

function stop() {
	now = Date.now()
	events.push({
		type: 'end',
		time: now
	});

	stats = `<div class="duration">${format(now - started)}</div>
Contraction Count: ${contraction_count()}<br/>
First Contraction: ${format(contraction_first())}<br/>
`

	statsLabel.innerHTML = stats;

	console.log(stats);

	started = -1;

	resultsCard.style.display = 'block';
	runningCard.style.display = 'none';
	
	// TODO ask about session.
}

function save() {
	notes = prompt('Notes?');
	if (notes === null) return;
	session = {
		notes,
		events,
		time: Date.now(),
		type: 'hold'
	}

	sessions.push(session);
	saveToStorage(sessions)

	reset();
}

function reset() {
	events = [];

	durationLabel.innerHTML = '0:00.0';
	toggleButton.innerHTML = 'Start';
	resultsCard.style.display = 'none';
	runningCard.style.display = 'block';
}

function interval() {
	ctx.save();
	const now = Date.now();

	time = now - started
	seconds = time / 1000 % 60;

	// update canvas
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.beginPath();

	ctx.strokeStyle = '#222';
	radius = canvas.width * 0.45;
	// console.log(radius);
	ring(radius, 1);

	timeline();

	if (started < 0) return ctx.restore();

	ctx.strokeStyle = 'yellow'; // '#ddd'; // red
	ring(radius, seconds / 60);

	label(format(time));

	return ctx.restore();
}

function timeline() {
	ctx.save();
	ctx.scale(dpr, dpr);
	ctx.translate(50, 50);
	ctx.font = '10px monospace';
	ctx.lineWidth = 1;
	ctx.strokeStyle = '#fff';

	const MINS = 60;
	const SECS_10 = 10;
	const PPS = 2; // unit pixel per second
	// 3.2

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

	let te = events;
	// te = sessions[sessions.length - 1];
	s = te.find(e => e.type === 'started')
	if (!s) return ctx.restore();
	s = s.time;

	ctx.lineWidth = 4;
	ctx.strokeStyle = 'red';
	ctx.fillStyle = 'red';
	te.forEach(e => {
		t = (e.time - s) / 1000 * PPS
		switch (e.type) {
			case 'contraction_start':
			ctx.beginPath();
				// ctx.arc(t, 18, 3, 0, 7)
				// ctx.fill();

				ctx.beginPath();
				ctx.moveTo(t, 18);
				break;
			case 'contraction_stop':
				ctx.lineTo(t, 18);
				ctx.strokeStyle = 'red';
				ctx.stroke();


				break;
			case 'end':
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

function label(text) {
	// var text = ctx.measureText('foo'); // TextMetrics object
	// text.width; // 16;
	// ctx.font = '20vmin monospace'; // 120px
	// ctx.fillStyle = 'greenyellow';
	// ctx.textAlign = 'center';
	// ctx.textBaseline = 'middle'; // "top" || "hanging" || "middle" || "alphabetic" || "ideographic" || "bottom";
	// ctx.fillText(text, canvas.width / 2, canvas.height / 2);

	durationLabel.innerHTML = text;
}

function ring(radius, t) {
	ctx.save();
	ctx.lineCap = 'round';
	ctx.lineWidth = radius / 20;
	ARC_OFFSET = - Math.PI / 2;

	ctx.beginPath();
	ctx.arc(canvas.width / 2, canvas.height / 2, radius, ARC_OFFSET, Math.PI * 2 * t + ARC_OFFSET, false);
	ctx.stroke();
	ctx.restore();
}

function format(lapse, dec = 1) {
	const ms = dec ? '.' + (lapse % 1000 / 100 | 0) : '';
	const total_s = lapse / 1000 | 0;
	const s = total_s % 60;
	const min = total_s / 60 | 0;

	return `${pad(min, 1)}:${pad(s)}${ms}`;
}

function pad(value, digits=2) {
	const string = value + '';
	return Array(Math.max(digits - string.length,0)).fill('0').join('') + string;
}