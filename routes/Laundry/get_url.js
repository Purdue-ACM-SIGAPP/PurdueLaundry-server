let getLocations = require('./get_locations');

module.exports = function (input, req) {
	return new Promise(function (resolve) {
		getLocations(req).then(function (locations) {
			resolve(locations.reduce((acc, item) => item.name === input ? item.url : ''));
		});
	});
};