// voice alerts


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

    nextAlert = -1;

    // kohei profile
    INTERVAL = 17.5 // 20 // 5 // 30
    alerts = [
        // '10m', '20m', '32m grab tag and return', '20m', '10m', 'breathe, breathe!!'
        '体は柔らかく ゆっくり落ち着いて',
        'フリーフォール体制に入る準備',
        'そのままじっと体は柔らかく',
        '信じて待つ',
        'タグを抜いてフッドに挾む',
        'ゆっくりひいて浮上',
        'ちゃんと息吸って、しっかり呼吸、最後にもうひと呼吸',
        'マスク、ノースクリップ、サイン'
    ]

    // josh profile
    INTERVAL = 20
    // alerts = [
    //     '10m, relax, pull more till freefall', '20m, equalize mask and draw air', '28m. grab your tag', '20m', '10m, prepare for recovery',
    //     'breathe!! breathe!! breathe! Mask! Sign! Say I\'m  ok']

    INTERVAL = 2 // debug override
    nextAlert = INTERVAL;
}

function init() {
    if (!window.speechSynthesis) {
        _init = false;
    }

    voices = speechSynthesis.getVoices()
    console.log(voices.length);
    if (voices.length) {
        onSpeechStart()
        setInterval(onSpeechInterval, 1000);
    }
    else setTimeout(init, 500);
}

function findVoice(name) {
    return voices.find(v => {
        return v.name === name
    })
}

function onSpeechInterval() {
    const now = Date.now();
    time = now - started

    if (nextAlert <= time / 1000 && window.speechSynthesis && alerts.length) {
        nextAlert += INTERVAL;
        text = alerts.shift();

        utterance = new SpeechSynthesisUtterance(text) // 0.05ms
        // utterance.pitch = pitch
        // utterance.rate
        utterance.voice = findVoice('Kyoko')

        console.log(utterance);
        console.time('utterance')
        speechSynthesis.speak(utterance); // 0.04ms
        console.timeEnd('utterance')

	}
}

init();

