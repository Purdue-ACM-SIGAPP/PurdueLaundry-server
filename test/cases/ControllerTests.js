/* eslint-env mocha */
const should = require('chai').should();
const Machine = require('../../server/classes/Machine');

describe('Controllers', () => {
	/**
	 * Controllers require a request and result from Express, so we make our custom request and result objects. We can
	 * edit the objects to have whatever properties we want (eg, req.cookies, req.params, etc) to match our tests'
	 * expectations.
	 *
	 * res.send and res.json have been mapped to different functions that simply store the result in the variable 'result'
	 */
	const req = {
		logger: {
			info: () => null
		},
		redis: {
			exists: () => 0,
			get: () => null,
			redis: {
				set: () => null,
				expire: () => null
			}
		}
	};

	let result;
	const res = {
		send: stuff => result = stuff,
		json: stuff => result = stuff
	};

	describe('MachineController', () => {
		const MachineController = require('../../server/controllers/MachineController');

		describe('getMachines', () => {
			it('doesn\'t throw an error', async () => {
				should.not.Throw(await MachineController.getMachines(req, res));
			});

			it('gets more than 1 location', async () => {
				await MachineController.getMachines(req, res);
				Object.keys(result).length.should.be.greaterThan(1);
			});

			it('returns Machine objects', async () => {
				await MachineController.getMachines(req, res);
				for (let m of result) {
					m.should.be.an.instanceOf(Machine);
				}
			});
		});

		describe('getMachinesAtLocation', () => {
			it('doesn\t throw an error', async () => {
				should.not.Throw(await MachineController.getMachinesAtLocation(req, res));
			});

			it('gets 1 location', async () => {
				await MachineController.getMachines(req, res);
				Object.keys(result).length.should.equal(1);
			});

			it('returns Machine objects', async () => {
				await MachineController.getMachines(req, res);
				for (let m of result) {
					m.should.be.an.instanceOf(Machine);
				}
			});
		});

		describe('getPossibleStatuses', () => {
			it('is correct', () => {
				MachineController.getPossibleStatuses(req, res);
				const expected = ['Available', 'In Use', 'Almost Done', 'End of Cycle', 'Out of Order', 'Offline', 'Ready To Start'];

				result.should.have.members(expected);
			});
		});
	});
});