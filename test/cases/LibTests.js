/* eslint-env mocha */
const scraper = require('../../server/lib/scraper');
const {randomData, comprehensiveData} = require('../../server/lib/mock-data');
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
// eslint-disable-next-line
const should = require('chai').should();
const nock = require('nock');

const read = p => fs.readFileSync(path.resolve(__dirname, p));

describe('lib', () => {
	describe('mock-data', () => {
		describe('randomData', () => {
			it('has a random length', () => {
				let arr1 = randomData();
				let arr2 = randomData();
				let arr3 = randomData();

				(arr1.length === arr2.length === arr3.length).should.not.equal(true);
			});

			it('is random', () => {
				let arr1 = randomData();
				let arr2 = randomData();

				arr1.should.not.have.members(arr2);
			});
		});

		describe('thoroughData', () => {
			it('is thorough', () => {
				let arr = comprehensiveData();

				let types = _.map(arr, m => m.type);
				let expected = ['Dryer', 'Washer'];
				let actual = _.sortBy(_.intersection(types, expected), String, 'asc');
				actual.should.have.members(expected);

				let statuses = _.map(arr, m => m.status);
				expected = ['Almost Done', 'Available', 'End of Cycle', 'In use'];
				actual = _.sortBy(_.intersection(statuses, expected), String, 'asc');
				actual.should.have.members(expected);

				let times = _.map(arr, m => m.time);
				expected = [' ', '0 minutes left'];
				actual = _.sortBy(_.intersection(times, expected), String, 'asc');
				actual.should.have.members(expected);
			});

			it('has a fixed length', () => {
				let arr1 = comprehensiveData();
				let arr2 = comprehensiveData();

				arr1.length.should.equal(arr2.length);
			});
		});
	});

	describe('scraper', () => {
		// This isn't testing Redis - use a fake one
		let redis = {
			get: () => null,
			exists: () => 0,
			redis: {
				set: () => null,
				expire: () => null
			}
		};

		/**
		 * We have no way of testing without consistent laundry data. When testing, ITaP may be offline,
		 * the testing computer may not have an internet connection, and we need to know what to test for.
		 * We can't set up unit tests without knowing what to expect
		 */
		function setUpSpy(url) {
			nock('http://wpvitassuds01.itap.purdue.edu/')
				.persist()
				.get(/.*/)
				.query(true)
				.reply(200, read(`../lib/${url}.html`));
		}

		/**
		 * Useful for generating tests
		 */
		function runTest(test, f, args, expected) {
			it(test.name, () => {
				setUpSpy(test.spy);
				const actual = f.apply(this, args);
				actual.should.deep.equal(expected);
			});
		}

		describe('scrapeLocations', () => {
			const expected = JSON.parse(read('../lib/locations.json', 'utf-8'));
			const tests = [
				{name: 'can scrape just the locations', spy: 'just_locations'},
				{name: 'can scrape locations with some HTML fluff', spy: 'locations_html_fluff'},
				{name: 'can scrape locations with other option tags', spy: 'locations_other_option_tags'},
				{name: 'can scrape a whole page', spy: 'whole_page'}
			];

			tests.forEach(test => runTest(test, scraper.scrapeLocations, [redis], expected));

			it('returns an empty object when there is an error', () => {
				setUpSpy('error');
				const actual = scraper.scrapeLocations(redis);
				actual.should.deep.equal({});
			});

			it('should be consistent with Purdue\'s API', async () => {
				const actual = await scraper.scrapeLocations(redis);
				actual.should.deep.equal(expected);
			});
		});

		describe('getUrlFor', () => {
			beforeEach(() => {
				// nock('http://wpvitassuds01.itap.purdue.edu/')
				// 	.get(/.*/)
				// 	.query(true)
				// 	.reply(200, read('../lib/just_locations.html', 'utf-8'));
			});

			it('can return a url for a valid location', async () => {
				let url = await scraper.getUrlFor('Earhart Laundry Room', redis);

				let root = 'http://wpvitassuds01.itap.purdue.edu/washalertweb/washalertweb.aspx';
				url.should.equal(`${root}?location=a0728ede-60be-4155-8ca9-dcde37ad431d`);
			});

			it('returns nothing with an invalid location', async () => {
				let url = await scraper.getUrlFor('is this the krusty krab?', redis);
				url.should.equal('');
			});
		});

		describe('scrapeAllMachines', () => {
			const expected = JSON.parse(read('../lib/machines.json', 'utf-8'));
			const tests = [
				{name: 'just machines', spy: 'just_all_machines'},
				{name: 'machines with fluff', spy: 'all_machines_fluff'},
				{name: 'full page', spy: 'whole_page'}
			];

			tests.forEach(test => runTest(test, scraper.scrapeAllMachines, [redis], expected));

			it('should return an empty object on an error', () => {
				setUpSpy('error');
				const actual = scraper.scrapeAllMachines(redis);
				actual.should.deep.equal({});
			});

			it('should be consistent with Purdue\'s API', async () => {
				const actual = await scraper.scrapeAllMachines(redis);
				actual.should.deep.equal(expected);
			});
		});

		describe('scrapeMachinesAt', () => {
			const expected = read('../lib/machines-earhart.json');
			const location = 'Cary Quad East Laundry';
			const tests = [
				{name: 'just machines', spy: 'just_machines'},
				{name: 'machines with fluff', spy: 'machines_fluff'},
				{name: 'full page', spy: 'full_page'}
			];

			tests.forEach(test => runTest(test, scraper.scrapeMachinesAt, [location, redis], expected));

			it('should return an empty object on an error', () => {
				setUpSpy('error');
				const actual = scraper.scrapeMachinesAt(location, redis);
				actual.should.deep.equal({});
			});

			it('should be consistent with Purdue\'s API', async () => {
				const actual = await scraper.scrapeMachinesAt(location, redis);
				actual.should.deep.equal(expected);
			});
		});
	});
});