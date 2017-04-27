// TODO: Add a catch block *somewhere*

const {scrapeAllMachines, scrapeMachinesAt, getUrlFor} = require('../lib/scraper');
const Redis = require('../classes/Redis');

async function getAllMachines(req) {
	req.logger.info({type: 'GET', location: 'all'});

	const redis = new Redis(req.redis);
	return await scrapeAllMachines(redis);
}

async function getMachines(req, res) {
	console.time('allStart');
	const redis = new Redis(req.redis);

	let allExists = await redis.exists('all');
	if (allExists === 0) {
		let machines = await getAllMachines(req);
		req.redis.set('all', JSON.stringify(machines));
		req.redis.expire('all', 60);
		res.json(machines);
	} else {
		let machines = await redis.get('all');
		console.timeEnd('allStart');
		res.json(JSON.parse(machines));
	}
}

async function getMachinesAtLocation(req, res) {
	req.logger.info({type: 'GET', location: req.params.location});
	let url = await getUrlFor(req.params.location, req);
	if (url === undefined) {
		req.logger.err('Incorrect URL');
		res.status(404).send('Error');
		return;
	}

	const redis = new Redis(req.redis);
	let exists = await redis.exists(req.params.location);

	if (exists === 0) {
		let results = await scrapeMachinesAt(req.params.location, redis);
		res.json(results);
	} else {
		let result = await redis.get(req.params.location);
		res.json(JSON.parse(result));
	}
}

function getPossibleStatuses(req, res) {
	let status = ['Available', 'In Use', 'Almost Done', 'End of Cycle', 'Out of Order', 'Offline', 'Ready To Start'];
	res.json(status);
}

module.exports = {
	getMachines, getMachinesAtLocation, getPossibleStatuses
};