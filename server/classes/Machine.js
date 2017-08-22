const cheerio = require('cheerio');

/**
 * This is the object used to represent a laundry machine
 *
 * name is the name as it is displayed on ITaP's website
 * displayName is the name as it is displayed in the app - the leading zeros are stripped
 * type is Washer or Dryer
 * status is Ready, In Use, Done, etc
 * time is the amount of time until the machine is done
 *
 * @type {Object}
 */
class Machine {
	constructor(name, displayName, type, status, time) {
		this.name = name;
		this.displayName = displayName;
		this.type = type;
		this.status = status;
		this.time = time;
	}

	/**
	 * Parse takes an HTML body and spits out an array of the machines in the body
	 */
	static parse(body) {
		// Initialize variables
		let results = [];
		let $ = cheerio.load(body);

		// Loop through the table rows of the HTML
		Array.from($('tr')).forEach(function (machine) {
			// A row will have a class iff (if and only if) it is a machine
			if (machine.class === '') {
				return;
			}

			// Extract the details we want from the HTML
			let name = $('.name', machine).text();
			let displayName = $('.name', machine).text().replace(/0+([1-9]+)/, '$1');
			let type = $('.type', machine).text();
			let status = $('.status', machine).text();
			let time = $('.time', machine).text();

			// Assuming this machine has a type, push it in end of the array
			if (type !== '') results.push(new Machine(name, displayName, type, status, time));
		});

		return results;
	}
}

module.exports = Machine;