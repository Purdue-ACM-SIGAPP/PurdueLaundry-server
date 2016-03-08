var parseHTML = require('./parse_html');
var getURL = require('./get_url');
var request = require('request');

var locations = ["cary", "earhart", "harrison", "hawkins", "hillenbrand", "mccutcheon", "meredith_nw", "meredith_se",
                 "owen","shreve","tarkington","third","wiley","windsor_duhme","windsor_warren"];

function getAllMachines(req){
  req.logger.info({type:'GET', location:'all'})
  return new Promise(function(resolve,reject){
    var machines = {}
    locations.map(function(location){
    req.redis.exists(location, function(err,exists){
        if(err){
          req.logger.err('Redis error- ' + err);
        }
        if(exists == 0 ){
          url = getURL(location);
          url = url.charAt(0).toUpperCase() + url.slice(1);
          request(url, function(err, response, body){
            var results = [];
            if ( !err && response.statusCode == 200 ){
              results = parseHTML(body);
              machines[location] = results;
              req.redis.set(location,JSON.stringify(results));
              req.redis.expire(location,60);
              if(Object.keys(machines).length === locations.length){
                resolve(machines);
              }
            }
          });
        } else {
          req.redis.get(location, function(err,result){
            if(err) req.logger.err('Redis Error- ' + err);
            machines[location] = JSON.parse(result);
            if(Object.keys(machines).length === locations.length){
              resolve(machines);
            }
          })
        }
      });
    });
  });
}


function getAllRoute(req,res){
  req.redis.exists('all',function(err,exists){
    if(exists == 0){
      getAllMachines(req)
        .then(function(machines){
          req.redis.set('all',JSON.stringify(machines));
          req.redis.expire('all',60);
          res.json(machines);
        });
    } else {
      req.redis.get('all',function(err,result){
        var machines = JSON.parse(result);
        res.json(machines);
      });
    }
  });
}

module.exports = getAllRoute;
