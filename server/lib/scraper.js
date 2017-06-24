const cheerio = require('cheerio');
const request = require('request-promise');
const parseHtml = require('../classes/Machine').parse;

/**
 * This function scrapes a list of all of the available laundry rooms. It returns an array of objects
 * specifying both the name and full url of each room
 */
async function scrapeLocations(redis) {
	// Initialize variables
	const url = 'http://wpvitassuds01.itap.purdue.edu/washalertweb/washalertweb.aspx';
	const key = 'location-urls';

	// Check to make sure they aren't already cached
	let exists = await redis.exists(key);
	if (exists === 0) {
		// Get the page contents
		let html = await request(url);
		let $ = cheerio.load(html);

		// Turn the `select` options into a fancy array
		let locations = Array.from($('#locationSelector').find('option')).map(e => ({
			'name': e.children[0].data,
			'url': url + '?location=' + e.attribs.value
		}));

		// Cache the results. The results are cached for 1 month because they don't change frequently
		redis.redis.set(key, JSON.stringify(locations));
		redis.redis.expire(key, 60 * 60 * 24 * 30);
		return locations;
	} else {
		// Great, they were cached! No HTTP requests today, Satan!
		return JSON.parse(await redis.get(key));
	}
}

/**
 * Arrays of objects are weird to deal with, so this method takes in a location, scrapes the URLs, then uses Array.find
 * to find our object
 */
async function getUrlFor(location, redis) {
	const locations = await scrapeLocations(redis);
	const l = locations.find(l => l.name === location);
	return l ? l.url : '';
}

/**
 * This method simply scrapes the locations, then goes through every one of them, scraping the machines on each page
 */
async function scrapeAllMachines(redis) {
	// Initialize variables
	let machines = {};
	let locations = await scrapeLocations(redis);

	// Scrape machines of every location
	for (let location of locations) {
		// Check to make sure the machines aren't cached
		let exists = await redis.exists(location.name);

		if (exists === 0) {
			// Get page contents
			let url = location.url;
			let body = await request(url);

			// Use our fancy parsing function
			let results = parseHtml(body);
			machines[location.name] = results;

			// Cache the results for 1 minute
			redis.redis.set(location.name, JSON.stringify(results));
			redis.redis.expire(location.name, 60 * 1000);
		} else {
			// Fantastic, they were cached! No HTTP requests today, Satan!
			let result = await redis.get(location.name);
			machines[location.name] = JSON.parse(result);
		}
	}

	return machines;
}

/**
 * This method takes a location, gets its url, then scrapes that url for the machines on that page
 */
async function scrapeMachinesAt(location, redis) {
	// Check to make sure location isn't cached
	let exists = await redis.exists(location);
	if (exists === 0) {
		// Get page contents
		let url = await getUrlFor(location, redis);
		let body = await request(url);

		// Use our fancy parsing function
		let results = parseHtml(body);

		// Cache the results for 1 minute
		redis.redis.set(location, JSON.stringify(results));
		redis.redis.expire(location, 60 * 1000);
		return results;
	} else {
		// Coolio, they were cached! No HTTP requests today, Satan!
		let result = await redis.get(location);
		return JSON.parse(result);
	}
}

module.exports = {scrapeLocations, getUrlFor, scrapeAllMachines, scrapeMachinesAt};