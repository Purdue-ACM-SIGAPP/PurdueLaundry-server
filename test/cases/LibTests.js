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
			spyOn(this, get).and.callFake(async () => await fs.read(`../lib/${url}_test_response.txt`));
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
				setUpSpy('scrape_locations_just_locations');
			}));

			it('locations with some HTML fluff', () => {
				setUpSpy('scrape_locations_html_fluff');
			});

			it('locations with other option tags', () => {
				setUpSpy('scrape_locations_other_option_tags');
			});

			it('whole page', () => {
				setUpSpy('scrape_locations_whole_page');
			});

			it('error', () => {
				setUpSpy('scrape_locations_error');
				let actual = scrapeLocations(redis);
				expect(actual).toBe([]);
			});
		});

		describe('getUrlFor', () => {
			it('valid url', wrapper(async () => {
				setUpSpy('get_url_for_valid_url');
				let url = await getUrlFor('Earhart Laundry Room', redis);

				let root = 'http://wpvitassuds01.itap.purdue.edu/washalertweb/washalertweb.aspx';
				expect(url).toEqual(`${root}?location=a0728ede-60be-4155-8ca9-dcde37ad431d`);
			}));

			it('invalid url', wrapper(async () => {
				setUpSpy('get_url_for_invalid_url');
				let url = await getUrlFor('is this the krusty krab?');
				expect(url).toEqual('');
			}));
		});

		describe('scrapeAllMachines', () => {
			it('just machines', () => {
				setUpSpy('scrape_all_machines_just_machines');
			});

			it('machines with fluff', () => {
				setUpSpy('scrape_all_machines_fluff');
			});

			it('full page', () => {
				setUpSpy('scrape_all_machines_full_page');
			});

			it('error', () => {
				setUpSpy('scrape_all_machines_error');
			});
		});

		describe('scrapeMachinesAt', () => {
			it('just machines', () => {
				setUpSpy('scrape_machines_at_just_machines');
			});

			it('machines with fluff', () => {
				setUpSpy('scrape_machines_at_fluff');
			});

			it('full page', () => {
				setUpSpy('scrape_machines_at_full_page');
			});

			it('error', () => {
				setUpSpy('scrape_machines_at_error');
			});
		});
	});
});