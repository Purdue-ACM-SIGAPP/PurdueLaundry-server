const Machine = require('../classes/Machine');

/**
 * Given a machine number and a type (washer or dryer), this function creates a Machine object
 */
function createNewMachines(number, type) {
	let name = type + ' ' + number;
	let time = getMachineTime();
	let status = getMachineStatus(time);
	return new Machine(name, name, type, status, time);
}

/**
 * This function spits out a random time string. It has a 1/6 chance of being available, 1/6 chance of being
 * done running, and a 4/6 chance of being still running
 */
function getMachineTime() {
	let time = Math.floor((Math.random() * 60) + 1);
	if (time > 50) {
		return ' ';
	} else if (time > 40) {
		return '0 minutes left';
	} else {
		return time + ' minutes left';
	}
}

/**
 * Given a fake time string, this function spits out the corresponding status
 */
function getMachineStatus(time) {
	if (time === ' ') {
		return 'Available';
	} else if (time < 5) {
		return 'Almost Done';
	} else if (time === '0 minutes left') {
		return 'End of cycle';
	} else {
		return 'In use';
	}
}

/**
 * This route just creates an array of a random amount of washers and a random amount of dryers
 *
 * @return {Array} an array of machines
 */
function randomData() {
	let numberOfWashers = Math.floor((Math.random() * 15) + 5);
	let numberOfDryers = Math.floor((Math.random() * 15) + 5);
	let machines = [];

	for (let i = 0; i < numberOfWashers; i++) {
		machines.push(createNewMachines(i, 'Washer'));
	}

	for (let i = 0; i < numberOfDryers; i++) {
		machines.push(createNewMachines(i, 'Dryer'));
	}

	return machines;
}

/**
 * This route, unlike randomData, creates an array of 9 washers and 9 dryers - this set of machines is guaranteed to
 * have every single status and a variety of times left between all 9 of each (or, minimally, the final 5 of each);
 *
 * @return {Array} an array of machines
 */
function comprehensiveData() {
	let machines = [];

	for (let i = 0; i < 4; i++) {
		machines.push(createNewMachines(i, 'Washer'));
	}

	machines.push(new Machine('Washer 5', 'Washer 5', 'Washer', 'Almost Done', '1 minute left'));
	machines.push(new Machine('Washer 6', 'Washer 6', 'Washer', 'Available', ' '));
	machines.push(new Machine('Washer 7', 'Washer 7', 'Washer', 'Almost Done', '4 minutes left'));
	machines.push(new Machine('Washer 8', 'Washer 8', 'Washer', 'End of Cycle', '0 minutes left'));
	machines.push(new Machine('Washer 9', 'Washer 9', 'Washer', 'In use', '18 minutes left'));

	for (let i = 0; i < 4; i++) {
		machines.push(createNewMachines(i, 'Dryer'));
	}

	machines.push(new Machine('Dryer 5', 'Dryer 5', 'Dryer', 'Almost Done', '1 minute left'));
	machines.push(new Machine('Dryer 6', 'Dryer 6', 'Dryer', 'Available', ' '));
	machines.push(new Machine('Dryer 7', 'Dryer 7', 'Dryer', 'Almost Done', '5 minutes left'));
	machines.push(new Machine('Dryer 8', 'Dryer 8', 'Dryer', 'End of Cycle', '0 minutes left'));
	machines.push(new Machine('Dryer 9', 'Dryer 9', 'Dryer', 'In use', '32 minutes left'));

	return machines;
}

module.exports = {randomData, comprehensiveData};