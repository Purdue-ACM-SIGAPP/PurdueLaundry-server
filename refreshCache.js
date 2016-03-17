var request = require('request')
var parseHTML = require('./routes/Laundry/parse_html');
var getURL = require('./routes/Laundry/get_url');
var locations = ["cary", "earhart", "harrison", "hawkins", "hillenbrand", "mccutcheon", "meredith_nw", "meredith_se",
                 "owen","shreve","tarkington","third","wiley","windsor_duhme","windsor_warren"];



function updateCache(redis,logger){
  logger.info({type:'refresh'});
  machines = {}
  locations.map(function(location){
    url = getURL(location);
    url = url.charAt(0).toUpperCase() + url.slice(1);
    grabHTML(url)
      .then(function(results){
        machines[location] = results;
        if(Object.keys(machines).length == locations.length){
          redis.set('all',JSON.stringify(machines));
          redis.expire('all',60);
        }
        redis.set(location, JSON.stringify(results));
        redis.expire(location,60);
      });
  });
}


function grabHTML(url){
  return new Promise(function(resolve,reject){
    request(url, function(err, response, body){
      var results = [];
      if ( !err && response.statusCode == 200 ){
        results = parseHTML(body);
        resolve(results);
      }
    });
  });
}


function refreshCache(redis,logger){
  setInterval(function(){
    updateCache(redis,logger);
  },60000);
}



module.exports = refreshCache;
