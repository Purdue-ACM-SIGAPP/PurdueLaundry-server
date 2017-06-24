/* eslint-env mocha */
const should = require('chai').should();
const fs = require('fs');

describe('Classes', () => {
	describe('Redis', () => {
		const r = require('redis');
		let redis;
		const Redis = require('../../server/classes/Redis');
		const key = 'meaning of life, the universe, and everything';
		const value = '42';

		beforeEach(async () => {
			const client = r.createClient();
			await new Promise((resolve,) => client.flushdb(() => resolve()));
			redis = new Redis(client);
		});

		it('constructor', () => {
			redis.should.have.property('get');
			redis.should.have.property('exists');
			redis.should.have.property('redis');

			redis.should.not.have.property('set');
			redis.should.not.have.property('expires');
		});

		describe('get', () => {
			beforeEach(async () => await new Promise((resolve,) => redis.redis.flushdb(() => resolve())));

			it('something stored', async () => {
				redis.redis.set(key, value);
				let result = await redis.get(key);
				result.should.equal(value);
			});

			it('something expired', async () => {
				redis.redis.set(key, value);
				redis.redis.expire(key, 1);

				// Sleep for 3 seconds, just in case 2 isn't enough
				await new Promise(resolve => setTimeout(resolve, 1250));
				let result = await redis.get(key);
				should.not.exist(result);
			});

			it('something never stored', async () => {
				let result = await redis.get(key);
				should.not.exist(result);
			});
		});

		describe('exists', () => {
			beforeEach(async () => await new Promise((resolve,) => redis.redis.flushdb(() => resolve())));

			it('something stored', async () => {
				redis.redis.set(key, value);
				let result = await redis.exists(key);
				result.should.equal(1);
			});

			it('something expired', async () => {
				redis.redis.set(key, value);
				redis.redis.expire(key, 1);

				// Sleep for 3 seconds, just in case 2 isn't enough
				await new Promise(resolve => setTimeout(resolve, 1250));
				let result = await redis.exists(key);
				result.should.equal(0);
			});

			it('something never stored', async () => {
				let result = await redis.exists(key);
				result.should.equal(0);
			});
		});
	});

	describe('Machines', () => {
		const Machine = require('../../server/classes/Machine');

		it('constructor', () => {
			const name = 'My Fancy Machine';
			const displayName = 'My More Readable Name';
			const type = 'Washer';
			const status = 'In Use';
			const time = '42 minutes remaining';

			const m = new Machine(name, displayName, type, status, time);

			m.name.should.equal(name);
			m.displayName.should.equal(displayName);
			m.type.should.equal(type);
			m.status.should.equal(status);
			m.time.should.equal(time);
		});

		describe('parser', () => {
			const tests = [
				// {name: '', page: '', machines: ''}
			];

			tests.forEach(t => {
				it(t.name, () => {
					const actual = Machine.parse(fs.readFileSync(`../lib/${t.page}.html`));
					const expected = JSON.parse(fs.readFileSync(`../lib/${t.machines}.json`));
					actual.should.have.deep.members(expected);
				});
			});

			it('just machines', () => {
				const webpage = `
					<li>Hello</li>
				`;
				const expected = [
					new Machine(0, 0, 0, 0, 0)
				];

				let machines = Machine.parse(webpage);
				machines.should.have.members(expected);
			});

			it('machines with some other rows', () => {
				const webpage = `
					<li>Hello</li>
				`;
				const expected = [
					new Machine(0, 0, 0, 0, 0)
				];

				let machines = Machine.parse(webpage);
				machines.should.have.members(expected);
			});

			it('a whole web page', () => {
				const webpage = `
					<li>Hello</li>
				`;
				const expected = [
					new Machine(0, 0, 0, 0, 0)
				];

				let machines = Machine.parse(webpage);
				machines.should.have.members(expected);
			});

			it('404 (no machines)', () => {
				const webpage = `
					<h1>404 Error</h1>
					<p>This webpage could not be found.</p>
				`;
				const expected = [];

				let machines = Machine.parse(webpage);
				machines.should.have.members(expected);
			});
		});
	});
});