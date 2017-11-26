
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
		type: 'contraction_on',
		time: Date.now()
	});
}

function contraction_up() {
	if (started < 0) return;
	events.push({
		type: 'contraction_off',
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
		type: 'start',
		time: started
	});

	instructions.style.display = 'none';
	toggleButton.innerHTML = 'Stop';

	onSpeechStart()
}


var voices = window.speechSynthesis.getVoices();
console.log('voices.length', voices.length);
var select = document.createElement('select');

for(i = 0; i < voices.length ; i++) {
  var option = document.createElement('option');
  option.textContent = voices[i].name + ' (' + voices[i].lang + ')';
  option.setAttribute('data-lang', voices[i].lang);
  option.setAttribute('data-name', voices[i].name);
  console.log(voices[i])
  select.appendChild(option);
}

document.body.appendChild(select);

function testSound() {
	
	beep = new SpeechSynthesisUtterance('beep')
	// beep.rate = 0.4
	// beep.volume
	beep.pitch = 10
	
	speechSynthesis.speak(beep);
}

function stop() {
	now = Date.now()
	events.push({
		type: 'stop',
		time: now
	});

	stats = `<div class="duration">${format(now - started)}</div>
Contraction Count: ${contraction_count(events)}<br/>
First Contraction: ${format(contraction_first(events))}<br/>
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

	timeline(events);

	if (started < 0) return ctx.restore();

	onSpeechInterval()

	ctx.strokeStyle = 'yellow'; // '#ddd'; // red
	ring(radius, seconds / 60);

	label(format(time));

	return ctx.restore();
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
