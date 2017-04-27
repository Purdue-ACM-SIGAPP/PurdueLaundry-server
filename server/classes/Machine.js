const cheerio = require('cheerio');

class Machine {
	constructor(name, displayName, type, status, time) {
		this.name = name;
		this.displayName = displayName;
		this.type = type;
		this.status = status;
		this.time = time;
	}

	static parse(body) {
		let results = [];
		let $ = cheerio.load(body);

		$('tr').forEach(function (machine) {
			if (machine.class === '') {
				return;
			}

			let name = $('.name', machine);
			let displayName = $('.name', machine).text().replace(/0+([1-9]+)/, '$1');
			let type = $('.type', machine).text();
			let status = $('.status', machine).text();
			let time = $('.time', machine).text();

			if (type !== '') results.push(new Machine(name, displayName, type, status, time));
		});

		return results;
	}
}

module.exports = Machine;