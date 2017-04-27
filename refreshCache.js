const request = require('request');
const parseHTML = require('./server/lib/Machine').parse;
const getLocations = require('./server/lib/scraper').scrapeLocations;


function updateCache(redis, logger) {
	logger.info({type: 'refresh'});
	let machines = {};
	getLocations(redis).then(locations => locations.forEach(function (location) {
		let url = location.url.charAt(0).toUpperCase() + location.url.slice(1);
		grabHTML(url)
			.then(function (results) {
				machines[location.name] = results;
				if (Object.keys(machines).length === locations.length) {
					redis.set('all', JSON.stringify(machines));
					redis.expire('all', 60);
				}
				redis.set(location.name, JSON.stringify(results));
				redis.expire(location.name, 60);
			});
	}));
}


function grabHTML(url) {
	return new Promise(function (resolve) {
		request(url, function (err, response, body) {
			let results = [];
			if (!err && response.statusCode === 200) {
				results = parseHTML(body);
				resolve(results);
			}
		});
	});
}


function refreshCache(redis, logger) {
	setInterval(() => updateCache(redis, logger), 60 * 1000);
}


module.exports = refreshCache;
