// voice alerts

nextAlert = -1;

function onSpeechStart() {
    alerts = window.speechSynthesis ? [
		new SpeechSynthesisUtterance(' '),
		// new SpeechSynthesisUtterance('30 seconds'),
		new SpeechSynthesisUtterance('1 minute'),
		new SpeechSynthesisUtterance('1:30'),
		new SpeechSynthesisUtterance('2 minute'),
		new SpeechSynthesisUtterance('2:30'),
		new SpeechSynthesisUtterance('3 minute'),
		new SpeechSynthesisUtterance('3:30'),
		new SpeechSynthesisUtterance('4 minute'),
		new SpeechSynthesisUtterance('4:30'),
		new SpeechSynthesisUtterance('5 minute'),
		new SpeechSynthesisUtterance('5:30'),
    ] : []
    
    nextAlert = 30;
}

function onSpeechInterval() {
    if (nextAlert <= time / 1000 && window.speechSynthesis && alerts.length) {
		nextAlert += 30;
		speechSynthesis.speak(alerts.shift());
	}
}

