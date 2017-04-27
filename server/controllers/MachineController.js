const request = require('request');

function getAllMachines(req) {
	req.logger.info({type: 'GET', location: 'all'});
	return new Promise(function (resolve) {
		let machines = {};
		getLocations(req).then(locations => locations.forEach(location => {
			req.redis.exists(location.name, function (err, exists) {
				if (err) {
					req.logger.err('Redis error- ' + err);
				}
				if (exists === 0) {
					let url = location.url;
					url = url.charAt(0).toUpperCase() + url.slice(1);
					request(url, function (err, response, body) {
						let results = [];
						if (!err && response.statusCode === 200) {
							results = parseHTML(body);
							machines[location.name] = results;
							req.redis.set(location.name, JSON.stringify(results));
							req.redis.expire(location.name, 60);
							if (Object.keys(machines).length === locations.length) {
								resolve(machines);
							}
						}
					});
				} else {
					req.redis.get(location.name, function (err, result) {
						if (err) req.logger.err('Redis Error- ' + err);
						machines[location.name] = JSON.parse(result);
						if (Object.keys(machines).length === locations.length) {
							resolve(machines);
						}
					});
				}
			});
		}))
			.catch(console.error);
	});
}

function getMachines(req, res) {
	console.time('allStart');
	req.redis.exists('all', function (err, exists) {
		if (exists === 0) {
			getAllMachines(req)
				.then(function (machines) {
					req.redis.set('all', JSON.stringify(machines));
					req.redis.expire('all', 60);
					res.json(machines);
				});
		} else {
			req.redis.get('all', function (err, result) {
				console.timeEnd('allStart');
				let machines = JSON.parse(result);
				res.json(machines);
			});
		}
	});
}

function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

function getMachinesAtLocation(req, res) {
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
}

function getPossibleStatuses(req, res) {
	let status = ['Available', 'In Use', 'Almost Done', 'End of Cycle', 'Out of Order', 'Offline', 'Ready To Start'];
	res.json(status);
}

module.exports = {
	getMachines, getMachinesAtLocation, getPossibleStatuses
};