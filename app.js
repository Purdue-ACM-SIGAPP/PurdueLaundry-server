// Initialize Express
const express = require('express');
const app = express();
app.set('port', (process.env.PORT || 5000));

// Initialize cache
const redis = require('redis');
const redisOptions = {
	host: 'redis',
	port: 6379,
	total_retry_time: 300000
};
const client = redis.createClient(redisOptions);

client.on('error', err => logger.error('redis error - ' + err));
client.on('connect', () => {
	logger.info('redis connected');
	app.listen(app.get('port'), logger.info('Application listening on port', app.get('port')));
});
const Redis = require('./server/classes/Redis');
let r = new Redis(client);

// Initialize logger
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

// Provide caching and logging to controllers
app.use((req, res, next) => {
	req.logger = logger;
	req.redis = r;
	// req.stats = stats;
	next();
});

// Set up routes
require('./server/routes')(app, client);