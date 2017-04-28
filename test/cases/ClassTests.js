describe('Classes', () => {
	describe('Redis', () => {
		const r = require('redis');
		const Redis = require('../../server/classes/Redis');

		it('constructor', () => {

		});

		describe('get', () => {
			it('something stored', () => {

			});

			it('something expired', () => {

			});

			it('something never stored', () => {

			});
		});

		describe('exists', () => {
			it('something stored', () => {

			});

			it('something expired', () => {

			});

			it('something never stored', () => {

			});
		});
	});

	describe('Machines', () => {
		const Machine = require('../../server/classes/Machine');

		it('constructor', () => {

		});

		describe('parser', () => {
			it('just machines', () => {

			});

			it('machines with some other rows', () => {

			});

			it('a whole web page', () => {

			});

			it('404 (no machines)', () => {

			});
		});
	});
});