// voice alerts

nextAlert = -1;
INTERVAL = 5 // 5 // 30

// TODO add deep sounds every second using Audio API

// TODO if no window.speechSynthesis, disable module

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

    alerts = ['5', '10', '15']

    alerts = alerts.map(text => new SpeechSynthesisUtterance(text))
    // nextAlert = INTERVAL;
}

function onSpeechInterval() {
    const now = Date.now();
    time = now - started

    if (nextAlert <= time / 1000 && window.speechSynthesis && alerts.length) {
        nextAlert += INTERVAL;
        text = alerts.shift();
        speechSynthesis.speak(text);
        // utterance = new SpeechSynthesisUtterance(text)
        // console.log(utterance);
        // speechSynthesis.speak(utterance);
        
	}
}

onSpeechStart()
setInterval(onSpeechInterval, 1000);
