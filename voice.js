// voice alerts

nextAlert = -1;
INTERVAL = 20 // 5 // 30

// TODO add deep sounds every second using Audio API

// TODO if no window.speechSynthesis, disable module

// TODO add count down

function onSpeechStart() {
    started = Date.now()
    alerts = [
		' ',
		// '30 seconds',
		'1 minute',
		'1:30',
		'2 minute',
		'2:30',
		'3 minute',
		'3:30',
		'4 minute',
		'4:30',
		'5 minute',
		'5:30',
    ]

    // alerts = ['5', '10', '15']
    alerts = ['10m', '20m', '30m grab tag and return', '20m', '10m', 'breath!!']

    nextAlert = INTERVAL;
}

function onSpeechInterval() {
    const now = Date.now();
    time = now - started

    if (nextAlert <= time / 1000 && window.speechSynthesis && alerts.length) {
        nextAlert += INTERVAL;
        text = alerts.shift();

        utterance = new SpeechSynthesisUtterance(text) // 0.05ms
        console.log(utterance);
        console.time('utterance')
        speechSynthesis.speak(utterance); // 0.04ms
        console.timeEnd('utterance')
        
	}
}

onSpeechStart()
setInterval(onSpeechInterval, 1000);
