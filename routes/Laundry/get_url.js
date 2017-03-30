let getLocations = require('./get_locations');

module.exports = function (input) {
	return new Promise(function (resolve, reject) {
		getLocations().then(function (locations) {
			resolve(locations.reduce((acc, item) => item.name === input ? item.url : ""));
		});
	});
};