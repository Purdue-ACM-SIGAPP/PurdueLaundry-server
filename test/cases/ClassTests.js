/* eslint-env mocha */
const should = require('chai').should();

describe('Classes', () => {
	describe('Redis', () => {
		const r = require('redis');
		let redis;
		const Redis = require('../../server/classes/Redis');

		beforeEach(() => {
			const redisOptions = {
				host: 'redis',
				port: 6379,
				total_retry_time: 300000
			};
			const client = r.createClient(redisOptions);
			redis = new Redis(client);
		});

		it('constructor', () => {
			redis.should.have.own.property('get');
			redis.should.have.own.property('exists');
			redis.should.have.own.property('redis');

			redis.should.not.have.own.property('set');
			redis.should.not.have.own.property('expires');
		});

		describe('get', () => {
			it('something stored', async () => {
				const key = 'meaning of life, the universe, and everything';
				const value = 42;

				redis.redis.set(key, value);
				let result = await redis.get(key);

				result.should.equal(value);
			});

			it('something expired', async () => {
				const key = 'meaning of life, the universe, and everything';
				const value = 42;

				redis.redis.set(key, value);
				redis.redis.expire(key, 2000);

				// Sleep for 3 seconds, just in case 2 isn't enough
				await new Promise(resolve => setTimeout(resolve, 3000));

				let result = await redis.get(key);

				result.should.not.equal(value);
			});

			it('something never stored', async () => {
				const key = 'meaning of life, the universe, and everything';
				const value = 42;

				let result = await redis.get(key);

				result.should.not.equal(value);
			});
		});

		describe('exists', () => {
			it('something stored', async () => {
				const key = 'meaning of life, the universe, and everything';
				const value = 42;

				redis.redis.set(key, value);
				let result = await redis.exists(key);

				result.should.equal(1);
			});

			it('something expired', async () => {
				const key = 'meaning of life, the universe, and everything';
				const value = 42;

				redis.redis.set(key, value);
				redis.redis.expire(key, 2000);

				// Sleep for 3 seconds, just in case 2 isn't enough
				await new Promise(resolve => setTimeout(resolve, 3000));

				let result = await redis.exists(key);

				result.should.equal(0);
			});

			it('something never stored', async () => {
				const key = 'meaning of life, the universe, and everything';

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