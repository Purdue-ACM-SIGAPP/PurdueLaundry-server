/* eslint-env jasmine */
/**
 * Unfortunately, Jasmine doesn't natively support async/await, so we have to use this convenient wrapper function
 * that I *totally* didn't steal off of https://github.com/jasmine/jasmine/issues/923 (thank you @jamesthurley!)
 */
function wrapper(async) {
	return done => {
		async().then(done, e => { fail(e); done(); });
	};
}

describe('Controllers', () => {
	/**
	 * Controllers require a request and result from Express, so we make our custom request and result objects. We can
	 * edit the objects to have whatever properties we want (eg, req.cookies, req.params, etc) to match our tests'
	 * expectations.
	 *
	 * res.send and res.json have been mapped to different functions that simply store the result in the variable 'result'
	 */
	const req = {};

	let result;
	const res = {
		send: stuff => result = stuff
	};

	describe('MachineController', () => {
		const MachineController = require('../../server/controllers/MachineController');

		describe('getMachines', () => {
			it('doesn\'t throw an error', wrapper(async () => {
				expect(await MachineController.getMachines(req, res)).not.toThrow();
			}));

			it('gets more than 1 location', wrapper(async () => {
				await MachineController.getMachines(req, res);
				expect(Object.keys(result).length).toBeGreaterThan(1);
			}));

			it('returns Machine objects', wrapper(async () => {
				await MachineController.getMachines(req, res);
				result.forEach(m => expect(typeof m).toBe('Machine'));
			}));
		});

		describe('getMachinesAtLocation', () => {
			it('doesn\t throw an error', wrapper(async () => {
				expect(await MachineController.getMachinesAtLocation(req, res)).not.toThrow();
			}));

			it('gets 1 location', wrapper(async () => {
				await MachineController.getMachines(req, res);
				expect(Object.keys(result).length).toBe(1);
			}));

			it('returns Machine objects', wrapper(async () => {
				await MachineController.getMachines(req, res);
				result.forEach(m => expect(typeof m).toBe('Machine'));
			}));
		});

		describe('getPossibleStatuses', () => {
			it('is correct', () => {
				MachineController.getPossibleStatuses(req, res);
				const expected = ['Available', 'In Use', 'Almost Done', 'End of Cycle', 'Out of Order', 'Offline', 'Ready To Start'];

				expect(result).toBe(expected);
			});
		});
	});
});