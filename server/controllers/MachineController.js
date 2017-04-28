// TODO: Add a catch block *somewhere*
const {scrapeAllMachines, scrapeMachinesAt, getUrlFor} = require('../lib/scraper');

async function getMachines(req, res) {
	// Logging
	req.logger.info({type: 'GET', location: 'all'});
	console.time('allStart');

	// Get the machines
	let machines = await scrapeAllMachines(req.redis);

	// Clock in and send response
	console.timeEnd('allStart');
	res.json(machines);
}

async function getMachinesAtLocation(req, res) {
	// Logging
	req.logger.info({type: 'GET', location: req.params.location});

	// Get the URL for this location
	let url = await getUrlFor(req.params.location, req);
	if (url === undefined) {
		req.logger.err('Incorrect URL');
		res.status(404).send('Error');
		return;
	}

	// Scrape the machines and send them
	let results = await scrapeMachinesAt(req.params.location, req.redis);
	res.json(results);
}

function getPossibleStatuses(req, res) {
	let status = ['Available', 'In Use', 'Almost Done', 'End of Cycle', 'Out of Order', 'Offline', 'Ready To Start'];
	res.json(status);
}

module.exports = {
	getMachines, getMachinesAtLocation, getPossibleStatuses
};