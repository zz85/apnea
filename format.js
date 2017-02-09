// Sample format
sessions = [
	{
		"time": 1486052070298,
		"events": [],
		"tags": [],
		"notes": '', // description
		// summary / duration / contractions
	},
]

/*
// type of events
v0
contraction_start // on
contraction_stop // off

type: 'started' // start
type: 'end' // stop


{
    notes,
    events,
    time: Date.now(),
    type: 'hold'
    version: 0
}

*/

sessions = loadFromStorage();

// Load

function loadFromStorage() {
    let sessions = [];

    try {
        sessions = JSON.parse(localStorage.apnea_sessions);
    }
    catch (e) {

    }
    
    return sessions;
}

// Save
function saveToStorage(sessions) {
    localStorage.apnea_sessions = JSON.stringify(sessions);
}