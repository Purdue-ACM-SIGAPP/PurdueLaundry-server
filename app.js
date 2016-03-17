var express = require('express');
var app = express();
var redis = require("redis");
var client = redis.createClient(6379,"ec2-52-27-152-61.us-west-2.compute.amazonaws.com");
var refreshCache = require('./refreshCache');

var StatsD = require('dogstatsd-node').StatsD,
    stats = new StatsD("ec2-52-37-183-17.us-west-2.compute.amazonaws.com",8126);

var log4js = require('log4js');
log4js.configure({
  'appenders': [
    {
      type      : 'console',
      category  : 'purdue-laundry'
    },
    {
      type      : 'loggly',
      token     : '5ac059d3-1b8c-4e5e-9059-0b6b080b3fee',
      subdomain : 'purduesigapp',
      tags      : ['purdue-laundry'],
      category  : 'purdue-laundry',
      json      : true
    },
  ]
});

var logger = log4js.getLogger('purdue-laundry');

client.on("error",function(err){
  logger.error('redis error - ' + err);
});

client.on('connect', function(connect){
  logger.info('redis connected');
  var server = app.listen(app.get('port'), function () {
    logger.info('Application listening on port', app.get('port'));
    refreshCache(client,logger);
  });
});


app.set('port', (process.env.PORT || 5000));
app.use(function(req,res,next){
    req.redis = client;
    req.logger = logger;
    req.stats = stats;
    next();
});



//LAUNDRY OPTIONS
app.get('/Laundry/test', require('./routes/Laundry/get_test'))
app.get('/Laundry/status', require('./routes/Laundry/get_status'))
app.get('/Laundry/v2/demo', require('./routes/Laundry/get_demo'))
app.get('/Laundry/:location', require('./routes/Laundry/get_info'))
app.get('/Laundry/location/all', require('./routes/Laundry/get_all'))
app.get('/Laundry/v2/:location', require('./routes/Laundry/get_test')) //this should be changed from the 'v2' as it is NOT a v2
