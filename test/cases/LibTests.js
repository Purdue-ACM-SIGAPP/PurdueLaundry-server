/**
 * Unfortunately, Jasmine doesn't natively support async/await, so we have to use this convenient wrapper function
 * that I *totally* didn't steal off of https://github.com/jasmine/jasmine/issues/923 (thank you @jamesthurley!)
 */
function wrapper(async) {
	return done => {
		async().then(done, e => {
			fail(e);
			done();
		});
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
		let {scrapeLocations, getUrlFor, scrapeAllMachines, scrapeMachinesAt, get} = require('../../server/lib/scraper');

		/**
		 * We have no way of testing without consistent laundry data. When testing, ITaP may be offline,
		 * the testing computer may not have an internet connection, and we need to know what to test for.
		 * We can't set up unit tests without knowing what to expect
		 */
		function setUpSpy(url) {
			const fs = require('fs');
			spyOn(this, get).and.callFake(async () => await fs.read(`../lib/${url}.html`));
		}

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
			it('just locations', wrapper(async () => {
				setUpSpy('just_locations');
			}));

			it('locations with some HTML fluff', () => {
				setUpSpy('locations_html_fluff');
			});

			it('locations with other option tags', () => {
				setUpSpy('locations_other_option_tags');
			});

			it('whole page', () => {
				setUpSpy('whole_page');
			});

			it('error', () => {
				setUpSpy('error');
				let actual = scrapeLocations(redis);
				expect(actual).toBe([]);
			});
		});

		describe('getUrlFor', () => {
			beforeEach(() => {
				// Mock getURLS
			});

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
				setUpSpy('just_all_machines');
			});

			it('machines with fluff', () => {
				setUpSpy('all_machines_fluff');
			});

			it('full page', () => {
				setUpSpy('all_machines_full_page');
			});

			it('error', () => {
				setUpSpy('error');
			});
		});

		describe('scrapeMachinesAt', () => {
			it('just machines', () => {
				setUpSpy('just_machines');
			});

			it('machines with fluff', () => {
				setUpSpy('machines_fluff');
			});

			it('full page', () => {
				setUpSpy('full_page');
			});

			it('error', () => {
				setUpSpy('error');
			});
		});
	});
});