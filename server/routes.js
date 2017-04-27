const MachineController = require('./controllers/MachineController');

module.exports = app => {
	app.get('/v1/status', MachineController.getPossibleStatuses);
	app.get('/v1/location/all', MachineController.getMachines);
	app.get('/v1/location/:location', MachineController.getMachinesAtLocation);
};