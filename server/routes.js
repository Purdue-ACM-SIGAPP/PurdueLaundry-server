const MachineController = require('./controllers/MachineController');

module.exports = (app, redis) => {
	/***********
	 * Caching *
	 ***********/
	/*
	 * These methods take the responsibility of caching from the
	 * controllers and gives it to the router. How it works is
	 * detailed in the documentation below.
	 */

	/**
	 * The first method in a route declaration is executed first. checkCache checks to make sure this route
	 * hasn't been requested in the last minute. If it has, it sends the result, and the controller never knew it got a
	 * request. If it hasn't, it calls next to execute the request as normal.
	 */
	async function checkCache(req, res, next) {
		let exists = await redis.exists(req.path);
		if (exists) {
			let result = await redis.get(req.path);
			res.send(JSON.parse(result));
		} else next();
	}

	/**
	 * makeSendStore is the next middleware. Because we now know the value is not in the cache, we need to change
	 * res.send to make it first store the about-to-be-sent value in the cache, then send it as normal.
	 */
	function makeSendStore(req, res, next) {
		const send = res.send;

		res.send = data => {
			redis.redis.set(req.path, JSON.stringify(data));
			redis.redis.expire(req.path, 1000 * 60);
			send(data);
		};

		next();
	}

	/**
	 * Because the codebase has moved from Promise hell (because apparently that's a thing) to async/await, errors
	 * now are errors thrown up the stack. Because of this, we need error middleware to catch and log the errors
	 * should they happen to come up
	 */
	function errorCatcher(err, req, res, next) {
		req.logger.err(err);
		res.status(500).send({
			message: 'There was an error!',
			error: err
		});
	}

	/**
	 * With only 3 routes, it is extremely likely a random request will not match 1, so we should provide a 404 route
	 */
	function fourOhFour(req, res) {
		res.status(404).send('This route does not exist!');
	}

	// Let's actually use the middleware
	app.use(checkCache);
	app.use(makeSendStore);
	app.use(errorCatcher);

	/**********
	 * Routes *
	 **********/
	/*
	 * This is where the routes are declared. All results will automatically be cached for 1 minute.
	 */
	app.get('/v1/status', MachineController.getPossibleStatuses);
	app.get('/v1/location/all', MachineController.getMachines);
	app.get('/v1/location/:location', MachineController.getMachinesAtLocation);
	app.all('*', fourOhFour);
};