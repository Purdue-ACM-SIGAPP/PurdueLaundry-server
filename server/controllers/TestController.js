const {randomData, comprehensiveData} = require('../lib/mock-data');

async function getMachines(req, res) {
	// Logging
	req.logger.info({type: 'GET', location: 'testAll'});

	// Get the machines
	let machines = [comprehensiveData()];
	for (let i = 0; i < 8; i++) machines.push(randomData());

	// Clock in and send response TODO: Times
	res.json(machines);
}

async function getLocations(req, res) {
	const locations = [
		'Lorem ipsum', 'dolor sit', 'amet consectetur',
		'adipiscing elit', 'Aliquam ornare', 'dolor neque',
		'et dapibus', 'ligula mollis', 'sit amet', 'Ut quis'
	];
	res.send(locations);
}

function getPossibleStatuses(req, res) {
	const statuses = ['Available', 'In Use', 'Almost Done',
		'End of Cycle', 'Out of Order', 'Offline', 'Ready To Start'
	];
	res.send(statuses);
}

module.exports = {
	getMachines, getPossibleStatuses, getLocations
};