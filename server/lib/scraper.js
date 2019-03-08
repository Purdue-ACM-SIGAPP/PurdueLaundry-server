const cheerio = require('cheerio');
const request = require('request-promise');
const parseHtml = require('../classes/Machine').parse;
const parseHtmlAll = require('../classes/Machine').parseAll;
const redis = require('../../app').redis;

/**
 * This function scrapes a list of all of the available laundry rooms. It returns an array of objects
 * specifying both the name and full url of each room
 */
async function scrapeLocations() {
	if (await redis.exists('locations')) return JSON.parse(await redis.get('locations'));

	// Initialize variables
	const url = 'http://wpvitassuds01.itap.purdue.edu/washalertweb/washalertweb.aspx';

	// Get the page contents
	let html = await request(url);
	let $ = cheerio.load(html);

	// Turn the `select` options into a fancy array
	let res = Array.from($('#locationSelector').find('option')).map(e => ({
		'name': e.children[0].data,
		'url': url + '?location=' + e.attribs.value
	}));
	redis.redis.set('locations', JSON.stringify(res));

	return res;
}

/**
 * Arrays of objects are weird to deal with, so this method takes in a location, scrapes the URLs, then uses Array.find
 * to find our object
 */
async function getUrlFor(location) {
	const locations = await scrapeLocations();
	const l = locations.find(l => l.name === location);
	return l ? l.url : '';
}

/**
 * This method simply scrapes the locations, then goes through every one of them, scraping the machines on each page
 */
async function scrapeAllMachines() {
	const url = 'http://wpvitassuds01.itap.purdue.edu/washalertweb/washalertweb.aspx';
	const body = await request(url);
	return parseHtmlAll(body);
}

/**
 * This method takes a location, gets its url, then scrapes that url for the machines on that page
 */
async function scrapeMachinesAt(location) {
	// Get page contents
	let url = await getUrlFor(location);
	let body = await request(url);

	// Use our fancy parsing function
	return parseHtml(body);
}

module.exports = {scrapeLocations, getUrlFor, scrapeAllMachines, scrapeMachinesAt};