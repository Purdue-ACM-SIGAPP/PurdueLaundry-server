const express = require('express');
const app = express();
const redis = require('redis');
const redisOptions = {
	host: 'redis',
	port: 6379,
	total_retry_time: 300000
};
const client = redis.createClient(redisOptions);
const refreshCache = require('./refreshCache');

const log4js = require('log4js');
log4js.configure({
	'appenders': [
		{
			type: 'console',
			category: 'purdue-laundry'
		},
		{
			type: 'loggly',
			token: '5ac059d3-1b8c-4e5e-9059-0b6b080b3fee',
			subdomain: 'purduesigapp',
			tags: ['purdue-laundry'],
			category: 'purdue-laundry',
			json: true
		},
	]
});

const logger = log4js.getLogger('purdue-laundry');

client.on('error', function (err) {
	logger.error('redis error - ' + err);
});

client.on('connect', function () {
	logger.info('redis connected');
	app.listen(app.get('port'), function () {
		logger.info('Application listening on port', app.get('port'));
		refreshCache(client, logger);
	});
});


app.set('port', (process.env.PORT || 5000));
app.use(function (req, res, next) {
	req.redis = client;
	req.logger = logger;
	//req.stats = stats;
	next();
});


//LAUNDRY OPTIONS
app.get('/v1/status', require('./routes/Laundry/get_status'));
app.get('/v1/location/all', require('./routes/Laundry/get_all'));
app.get('/v1/location/:location', require('./routes/Laundry/get_info'));