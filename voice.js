// voice alerts

// TODO add deep sounds every second using Audio API

// TODO if no window.speechSynthesis, disable module

// TODO add count down

let least = 0
let currentAlertIndex = -1;

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
        'タグを抜いてフッドに入れて',
        'ゆっくりひいて浮上',
        'ちゃんと息吸って、しっかり呼吸、最後にもうひと呼吸',
        'マスク、ノースクリップ、サイン'
    ]

    // josh profile
    INTERVAL = 20
    alerts = [
        '10m, relax, pull till freefall',
        '20m, equalize mask and draw air',
        '30m. prepare to grab tag',
        '20m',
        '10m, prepare for recovery',
        'breathe!! breathe!! breathe! Mask! Sign! Say I\'m  ok'
    ]

    INTERVAL = 2 // debug override
    nextAlert = INTERVAL;

    interpretScript(standardCountdown)

    next = alerts[currentAlertIndex++ + 1]
    nextAlert = next.timeValue + least;
}

standardCountdown = `
-2min | 2 minutes
-1:30 | 1 30
-1    | 1 minute
-30s  | 30
-20s  | 20
-10s  | 10
-5    | 5
-4    | 4
-3    | 3
-2    | 2
-1    | 1
0     | Official Top
1     | 1
2     | 2
3     | 3
4     | 4
5     | 5
6     | 6
7     | 7
8     | 8
9     | 9
10    | 10
20  | 10m, relax, pull till freefall
40  | 20m, equalize mask and draw air
55  | 30m. prepare to grab tag
1:15 |  20m
1:35 |  10m, prepare for recovery
1:55 |  breathe!! breathe!! breathe! Mask! Sign! Say I\'m  ok
`

function interpretScript(text) {
    const lines = text.split(/\n/)
    splitter = /(.*)\|(.*)/
    let timeValue, unit

    alerts = [];

    lines.forEach((line, i) => {
        split = splitter.exec(line)
        if (split) {
            time = split[1].trim();
            text = split[2].trim();

            [timeValue, unit] = parseTime(time, unit);
            alerts.push({ timeValue, text })
            least = Math.min(timeValue, least)
        }
    })

    least = least * -1;
    console.log('least', least);
}

/**
 * -2min -> -120
 * 1:30 -> 90
 * 
 * (negation)(value)(units) => timevalue
 */
function parseTime(time, unit) {
    const neg = /(-)(.*)/.exec(time)
    const isNeg = neg && neg.length === 3;
    if (isNeg) time = neg[2];

    let mins = /(.*)(m|min|minute|minutes)/.exec(time)
    let secs = /(.*)(s|seconds)/.exec(time)
    if (!mins && !secs && unit) {
        if (unit === 'min') mins = [0, time];
        if (unit === 's') secs = [0, time]
    }

    let value

    if (mins) {
        mins = mins[1].split(':');
        if (mins.length === 2) {
            value = mins[0] * 60 + +mins[1]
        }
        else {
            value = mins[0] * 60;
        }
    }
    else {
        value = +secs[1];
    }

    if (isNeg) value = -value;
    return [value, mins ? 'min' : 's'];
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

/*
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
 */

function findVoice(name) {
    return voices.find(v => {
        return v.name === name
    })
}

function onSpeechInterval() {
    const now = Date.now();
    time = now - started
    offsettime = time - least * 1000 // offset

    // document.body
    label.innerHTML = format(offsettime);

    if (nextAlert <= time / 1000 && alerts.length) {
        // nextAlert += INTERVAL;
        current = alerts[currentAlertIndex]
        if (!current) return;
        text = current.text
        next = alerts[++currentAlertIndex]
        console.log('current', current, 'next', next)
        if (next) {
            nextAlert += next.timeValue - current.timeValue;
            console.log('nextAlert', nextAlert);
        }

        

        utterance = new SpeechSynthesisUtterance(text) // 0.05ms
        // utterance.pitch = pitch
        // utterance.rate
        utterance.voice = findVoice('Tessa')
        // Alex, Daniel, Fred, Fiona, Karen, Tessa*, Moira (IE), Samantha(US), Veena - English
        // Kyoko

        console.log(utterance);
        console.time('utterance')
        speechSynthesis.speak(utterance); // 0.04ms
        console.timeEnd('utterance')
	}
}

init();

