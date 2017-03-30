const cheerio = require('cheerio');
const request = require('request');

module.exports = function getLocations() {
	const url = "http://wpvitassuds01.itap.purdue.edu/washalertweb/washalertweb.aspx";
	return new Promise(function (resolve, reject) {
		request(url, (error, response, html) => {
			if (error) reject(error);

			let $ = cheerio.load(html);
			let locations = Array.from($('#locationSelector > option')).map(e => {
				return {
					"name": e.children[0].data,
					"url": url + "?location=" + e.attribs.value
				};
			});
			resolve(locations);
		});
	});
};