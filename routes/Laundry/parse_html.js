const cheerio = require('cheerio');

function Machine(name, type, status, time) {
	this.name = name;
	this.type = type;
	this.status = status;
	this.time = time;
}

module.exports = function (body) {
	let results = [];
	$ = cheerio.load(body);
	$('tr').map(function (i, el) {
		if ($(this).attr('class') === '') {
			return;
		}
		$(this).map(function (j, child) {
			let name = $('.name', this).text();
			let type = $('.type', this).text();
			let status = $('.status', this).text();
			let time = $('.time', this).text();
			if (type != '') {
				results.push(new Machine(name, type, status, time));
			}

		});
	});
	return results;
};