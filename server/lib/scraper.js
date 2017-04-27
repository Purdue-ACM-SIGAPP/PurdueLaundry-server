const cheerio = require('cheerio');
const request = require('request');

function scrapeLocations(redis) {
	const url = 'http://wpvitassuds01.itap.purdue.edu/washalertweb/washalertweb.aspx';
	return new Promise(function (resolve, reject) {
		redis.get('location-urls', function (err, result) {
			if (err) reject(err);
			if (result) resolve(JSON.parse(result));
			else {
				request(url, (error, response, html) => {
					if (error) reject(error);

					let $ = cheerio.load(html);
					let locations = Array.from($('#locationSelector > option')).map(e => {
						return {
							'name': e.children[0].data,
							'url': url + '?location=' + e.attribs.value
						};
					});

					redis.set('location-urls', JSON.stringify(locations));
					redis.expire('location-urls', 1000 * 60 * 60 * 24);
					resolve(locations);
				});
			}
		});
	});
}

function getUrlFor(location, req) {
	return scrapeLocations(req.redis).then(locations => locations.reduce((acc, item) => item.name === location ? item.url : ''));
}

function scrapeMachines(redis) {

}

function scrapeMachinesAt(location) {

}

module.exports = {scrapeLocations, getUrlFor, scrapeMachines, scrapeMachinesAt};