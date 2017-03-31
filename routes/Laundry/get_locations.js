const cheerio = require('cheerio');
const request = require('request');

module.exports = function getLocationURLs() {
	const url = "http://wpvitassuds01.itap.purdue.edu/washalertweb/washalertweb.aspx";
	return new Promise(function (resolve, reject) {
		req.redis.get('location-urls', function (err, result) {
			if (err) reject(err);
			if (result) resolve(JSON.parse(result));
			else {
				request(url, (error, response, html) => {
					if (error) reject(error);

					let $ = cheerio.load(html);
					let locations = Array.from($('#locationSelector > option')).map(e => {
						return {
							"name": e.children[0].data,
							"url": url + "?location=" + e.attribs.value
						};
					});

					req.redis.set('location-urls', JSON.stringify(locations));
					req.redis.expire('location-urls', 1000 * 60 * 60 * 24);
					resolve(locations);
				});
			}
		});
	});
};