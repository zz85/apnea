function contraction_count() {
	return events.filter(e => e.type === 'contraction_start').length;
}

function contraction_first() {
	const first = events.find(e => e.type === 'contraction_start');
	if (!first) return -1;
	const lapse = first.time - started;
	return lapse;
}

function contraction_avg_interval() {
	// TODO
}

function contraction_avg_duration() {
	// TODO
}