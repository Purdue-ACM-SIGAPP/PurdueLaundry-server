function Machine(name, type, status, time) {
	this.name = name;
	this.type = type;
	this.status = status;
	this.time = time;
}

module.exports = function (req, res) {
	let numberOfWashers = 4;
	let numberOfDryers = 4;
	let machines = [];
	for (let i = 0; i < numberOfWashers; i++) {
		machines.push(createNewMachines(i, "Washer"));
	}
	machines.push(new Machine("Washer 5", "Washer", "Almost Done", "1 minute left"));
	machines.push(new Machine("Washer 6", "Washer", "Available", " "));
	machines.push(new Machine("Washer 7", "Washer", "Almost Done", "4 minutes left"));
	machines.push(new Machine("Washer 8", "Washer", "End of Cycle", "0 minutes left"));
	machines.push(new Machine("Washer 9", "Washer", "In use", "18 minutes left"));
	for (i = 0; i < numberOfDryers; i++) {
		machines.push(createNewMachines(i, "Dryer"));
	}
	machines.push(new Machine("Dryer 5", "Dryer", "Almost Done", "1 minute left"));
	machines.push(new Machine("Dryer 6", "Dryer", "Available", " "));
	machines.push(new Machine("Dryer 7", "Dryer", "Almost Done", "5 minutes left"));
	machines.push(new Machine("Dryer 8", "Dryer", "End of Cycle", "0 minutes left"));
	machines.push(new Machine("Dryer 9", "Dryer", "In use", "32 minutes left"));
	res.json(machines);
};

function createNewMachines(number, type) {
	let name = type + " " + number;
	let time = getMachineTime();
	let status = getMachineStatus(time);
	return new Machine(name, type, status, time);
}

function getMachineTime() {
	let time = Math.floor((Math.random() * 60) + 1);
	if (time > 50) {
		return " ";
	} else if (time > 40) {
		return "0 minutes left";
	} else {
		return time + " minutes left";
	}
}

function getMachineStatus(time) {
	if (time === " ") {
		return "Available"
	} else if (time < 5) {
		return "Almost Done"
	} else if (time === " ") {
		return "Available";
	} else if (time === "0 minutes left") {
		return "End of cycle"
	} else {
		return "In use";
	}
}