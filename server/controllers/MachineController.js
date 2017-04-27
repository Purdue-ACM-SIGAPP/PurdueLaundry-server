const request = require('request');
const getURL = require('../lib/scraper').getUrlFor;
const getLocations = require('../lib/scraper').scrapeLocations;
const parseHTML = require('../lib/Machine').parse;
const Redis = require('../lib/Redis');

async function getAllMachines(req) {
	req.logger.info({type: 'GET', location: 'all'});

	const redis = new Redis(req.redis);
	let machines = {};
	let locations = await getLocations(req.redis);
	for (let location of locations) {
		let exists = await redis.exists(location.name);
		// if (err) req.logger.err('Redis error- ' + err);

		if (exists === 0) {
			let url = capitalizeFirstLetter(location.url);
			let body = await request(url);
			let results = parseHTML(body);
			machines[location.name] = results;
			req.redis.set(location.name, JSON.stringify(results));
			req.redis.expire(location.name, 60);
		} else {
			let result = await redis.get(location.name);
			// if (err) req.logger.err('Redis Error- ' + err);
			machines[location.name] = JSON.parse(result);
		}
	}

	return machines;
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

function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

async function getMachinesAtLocation(req, res) {
	req.logger.info({type: 'GET', location: req.params.location});
	let u = await getURL(req.params.location, req);
	let url = capitalizeFirstLetter(u);
	if (url === undefined) {
		req.logger.err('Incorrect URL');
		res.status(404).send('Error');
		return;
	}

	const redis = new Redis(req.redis);
	let exists = await redis.exists(req.params.location);
	// if (err) {
	// 	req.logger.err('Redis error- ' + err);
	// }

	if (exists === 0) {
		let body = await request(url);
		let results = parseHTML(body);
		req.redis.set(req.params.location, JSON.stringify(results));
		req.redis.expire(req.params.location, 60);
		res.json(results);
	} else {
		let result = await redis.get(req.params.location);
		// if (err) req.logger.err('Redis Error- ' + err);
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