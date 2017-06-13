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
			expect(redis.hasOwnProperty('get')).toBeTruthy();
			expect(redis.hasOwnProperty('exists')).toBeTruthy();
			expect(redis.hasOwnProperty('redis')).toBeTruthy();

			expect(redis.hasOwnProperty('set')).toBeFalsy();
			expect(redis.hasOwnProperty('expires')).toBeFalsy();
		});

		describe('get', () => {
			it('something stored', wrapper(async () => {
				const key = 'meaning of life, the universe, and everything';
				const value = 42;

				redis.redis.set(key, value);
				let result = await redis.get(key);

				expect(result).toBe(value);
			}));

			it('something expired', wrapper(async () => {
				const key = 'meaning of life, the universe, and everything';
				const value = 42;

				redis.redis.set(key, value);
				redis.redis.expire(key, 2000);

				// Sleep for 3 seconds, just in case 2 isn't enough
				await new Promise(resolve => setTimeout(resolve, 3000));

				let result = await redis.get(key);

				expect(result).not.toBe(value);
			}));

			it('something never stored', wrapper(async () => {
				const key = 'meaning of life, the universe, and everything';
				const value = 42;

				let result = await redis.get(key);

				expect(result).not.toBe(value);
			}));
		});

		describe('exists', () => {
			it('something stored', wrapper(async () => {
				const key = 'meaning of life, the universe, and everything';
				const value = 42;

				redis.redis.set(key, value);
				let result = await redis.exists(key);

				expect(result).toBe(1);
			}));

			it('something expired', wrapper(async () => {
				const key = 'meaning of life, the universe, and everything';
				const value = 42;

				redis.redis.set(key, value);
				redis.redis.expire(key, 2000);

				// Sleep for 3 seconds, just in case 2 isn't enough
				await new Promise(resolve => setTimeout(resolve, 3000));

				let result = await redis.exists(key);

				expect(result).toBe(0);
			}));

			it('something never stored', wrapper(async () => {
				const key = 'meaning of life, the universe, and everything';

				let result = await redis.exists(key);

				expect(result).toBe(0);
			}));
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

			expect(m.name).toBe(name);
			expect(m.displayName).toBe(displayName);
			expect(m.type).toBe(type);
			expect(m.status).toBe(status);
			expect(m.time).toBe(time);
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
				expect(machines).toEqual(expected);
			});

			it('machines with some other rows', () => {
				const webpage = `
					<li>Hello</li>
				`;
				const expected = [
					new Machine(0, 0, 0, 0, 0)
				];

				let machines = Machine.parse(webpage);
				expect(machines).toEqual(expected);
			});

			it('a whole web page', () => {
				const webpage = `
					<li>Hello</li>
				`;
				const expected = [
					new Machine(0, 0, 0, 0, 0)
				];

				let machines = Machine.parse(webpage);
				expect(machines).toEqual(expected);
			});

			it('404 (no machines)', () => {
				const webpage = `
					<h1>404 Error</h1>
					<p>This webpage could not be found.</p>
				`;
				const expected = [];

				let machines = Machine.parse(webpage);
				expect(machines).toEqual(expected);
			});
		});
	});
});