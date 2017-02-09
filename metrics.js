function contraction_count(events) {
	return events.filter(e => e.type === 'contraction_on').length;
}

function contraction_first(events, started=time_start(events)) {
	const first = events.find(e => e.type === 'contraction_on');
	if (!first) return -1;
	const lapse = first.time - started;
	return lapse;
}

function contraction_last(events, started=time_start(events)) {
	const first = events.slice().reverse().find(e => e.type === 'contraction_off');
	if (!first) return -1;
	const lapse = first.time - started;
	return lapse;
}

function time_start(events) {
	const first = events.find(e => e.type === 'start');
	return first && first.time;
}

function time_stop(events) {
	const first = events.find(e => e.type === 'stop');
	return first && first.time;
}

function contraction_period(events, started=time_start(events)) {
	return contraction_last(events, started) - contraction_first(events, started);
}

function contraction_avg_interval(events, count=contraction_count(events)) {
	if (!count) return 0;
	return contraction_period(events) / count;
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

function formatDate(date) {
  var monthNames = [
    "January", "February", "March",
    "April", "May", "June", "July",
    "August", "September", "October",
    "November", "December"
  ];

  var day = date.getDate();
  var monthIndex = date.getMonth();
  var year = date.getFullYear();

  return pad(day) + ' ' + monthNames[monthIndex].slice(0, 3) + ' ' + year
  + ' ' + ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2);
}

function formatTime(date) {
	var options = {
		weekday: "short", year: "numeric", month: "short",
		day: "2-digit", hour: "2-digit", minute: "2-digit",
		hour12: false
	};

	return date.toLocaleTimeString("en-us", options)
}