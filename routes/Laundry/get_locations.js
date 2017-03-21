const cheerio = require('cheerio');
const request = require('request');

module.exports = function getLocations() {
	const url = "http://wpvitassuds01.itap.purdue.edu/washalertweb/washalertweb.aspx";
	request.get(url).on('response', r => {
		let $ = cheerio.load(r.body);
		return $('option').map(e => {
			return {
				"name": e.innerText,
				"url": url + "?location=" + e.value
			};
		});
	}).on('error', e => {
		return e;
	});
};