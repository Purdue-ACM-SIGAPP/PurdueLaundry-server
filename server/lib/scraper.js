const cheerio = require('cheerio');
const request = require('request-promise');
const Redis = require('../lib/Redis');

async function scrapeLocations(redisInstance) {
	const url = 'http://wpvitassuds01.itap.purdue.edu/washalertweb/washalertweb.aspx';
	const redis = new Redis(redisInstance);
	let urls = await redis.get('location-urls');

	if (urls) return JSON.parse(urls);
	else {
		let html = await request(url);
		let $ = cheerio.load(html);
		let locations = Array.from($('#locationSelector').find('option')).map(e => {
			return {
				'name': e.children[0].data,
				'url': url + '?location=' + e.attribs.value
			};
		});

		redisInstance.set('location-urls', JSON.stringify(locations));
		redisInstance.expire('location-urls', 1000 * 60 * 60 * 24);
		return locations;
	}
}

async function getUrlFor(location, req) {
	let locations = await scrapeLocations(req.redis);
	return locations.reduce((acc, item) => item.name === location ? item.url : '');
}

function scrapeMachines(redis) {

}

function scrapeMachinesAt(location) {

}

module.exports = {scrapeLocations, getUrlFor, scrapeMachines, scrapeMachinesAt};