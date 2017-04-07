const request = require('request');
const getURL = require('./get_url');
const parseHTML = require('./parse_html');

module.exports = function (req, res) {
	req.logger.info({type: 'GET', location: req.params.location});
	getURL(req.params.location, req).then(function (u) {
		let url = capitalizeFirstLetter(u);
		if (url === undefined) {
			req.logger.err('Incorrect URL');
			res.status(404).send('Error');
			return;
		}

		req.redis.exists(req.params.location, function (err, exists) {
			if (err) {
				req.logger.err('Redis error- ' + err);
			}

			if (exists === 0) {
				request(url, function (err, response, body) {
					let results = [];
					if (!err && response.statusCode === 200) {
						results = parseHTML(body);
					}
					req.redis.set(req.params.location, JSON.stringify(results));
					req.redis.expire(req.params.location, 60);
					res.json(results);
				});
			} else {
				req.redis.get(req.params.location, function (err, result) {
					if (err) req.logger.err('Redis Error- ' + err);
					let oldResponse = JSON.parse(result);
					res.json(oldResponse);
				});
			}
		});
	});
};

function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}
