/**
 * Unfortunately, Jasmine doesn't natively support async/await, so we have to use this convenient wrapper function
 * that I *totally* didn't steal off of https://github.com/jasmine/jasmine/issues/923 (thank you @jamesthurley!)
 */
function wrapper(async) {
	return done => {
		async().then(done, e => { fail(e); done(); });
	};
}

describe('lib', () => {
	describe('mock-data', () => {
		let {randomData, comprehensiveData} = require('../../server/lib/mock-data');

		describe('randomData', () => {
			it('is random', () => {
				let arr1 = randomData();
				let arr2 = randomData();
				let arr3 = randomData();

				expect(arr1.length === arr2.length === arr3.length).toBeFalsy();
			});
		});

		describe('thoroughData', () => {
			it('is thorough', () => {

			});

			it('has a fixed length', () => {
				let arr1 = comprehensiveData();
				let arr2 = comprehensiveData();

				expect(arr1.length).toEqual(arr2.length);
			});
		});
	});

	describe('scraper', () => {
		let {scrapeLocations, getUrlFor, scrapeAllMachines, scrapeMachinesAt} = require('../../server/lib/scraper');

		// This isn't testing Redis - use a fake one
		let redis = {
			get: () => null,
			exists: () => 0,
			redis: {
				set: () => null,
				expire: () => null
			}
		};

		describe('scrapeLocations', () => {
			it('just locations', () => {

			});

			it('locations with some HTML fluff', () => {

			});

			it('locations with other option tags', () => {

			});

			it('whole page', () => {

			});

			it('404', () => {

			});
		});

		/**
		 * These tests may have to be changed in the future. It all depends on how much the list of dorms with
		 * laundry machines changes
		 */
		describe('getUrlFor', () => {
			it('valid url', wrapper(async () => {
				let url = await getUrlFor('Earhart Laundry Room', redis);

				let root = 'http://wpvitassuds01.itap.purdue.edu/washalertweb/washalertweb.aspx';
				expect(url).toEqual(`${root}?location=a0728ede-60be-4155-8ca9-dcde37ad431d`);
			}));

			it('invalid url', wrapper(async () => {
				let url = await getUrlFor('is this the krusty krab?');
				expect(url).toEqual('');
			}));
		});

		describe('scrapeAllMachines', () => {
			it('just machines', () => {

			});

			it('machines with fluff', () => {

			});

			it('full page', () => {

			});

			it('404', () => {

			});
		});

		describe('scrapeMachinesAt', () => {
			it('just machines', () => {

			});

			it('machines with fluff', () => {

			});

			it('full page', () => {

			});

			it('404', () => {

			});
		});
	});
});