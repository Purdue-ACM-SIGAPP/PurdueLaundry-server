const cheerio = require('cheerio');
const request = require('request-promise');
const parseHtml = require('../classes/Machine').parse;

async function scrapeLocations(redis) {
	const url = 'http://wpvitassuds01.itap.purdue.edu/washalertweb/washalertweb.aspx';
	const key = 'location-urls';

	let exists = await redis.exists(key);
	if (exists === 0) {
		let html = await request(url);
		let $ = cheerio.load(html);
		let locations = Array.from($('#locationSelector').find('option')).map(e => {
			return {
				'name': e.children[0].data,
				'url': url + '?location=' + e.attribs.value
			};
		});

		redis.redis.set('location-urls', JSON.stringify(locations));
		redis.redis.expire('location-urls', 1000 * 60 * 60 * 24);
		return locations;
	} else {
		return await redis.get(key);
	}
}

async function getUrlFor(location, redis) {
	let locations = await scrapeLocations(redis);
	return locations.reduce((acc, item) => item.name === location ? item.url : '');
}

async function scrapeAllMachines(redis) {
	let machines = {};
	let locations = await scrapeLocations(redis);
	for (let location of locations) {
		let exists = await redis.exists(location.name);

		if (exists === 0) {
			let url = location.url;
			let body = await request(url);
			let results = parseHtml(body);
			machines[location.name] = results;
			redis.redis.set(location.name, JSON.stringify(results));
			redis.redis.expire(location.name, 60);
		} else {
			let result = await redis.get(location.name);
			machines[location.name] = JSON.parse(result);
		}
	}
}

async function scrapeMachinesAt(location, redis) {
	let exists = await redis.exists(location);
	if (exists === 0) {
		let result = await redis.get(location);
		return JSON.parse(result);
	} else {
		let url = await getUrlFor(location);
		let body = await request(url);
		let results = parseHtml(body);
		redis.redis.set(location, JSON.stringify(results));
		redis.redis.expire(location, 60);
		return results;
	}
}

module.exports = {scrapeLocations, getUrlFor, scrapeAllMachines, scrapeMachinesAt};