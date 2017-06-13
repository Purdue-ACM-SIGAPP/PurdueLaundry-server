/**
 * This class is a wrapper for Redis - it makes get and exists into Promises instead of promoting callback hell.
 *
 * Whenever a controller function uses redis as a parameter, it should be a Redis object, not an instance of the
 * underlying client. It makes it a little less than ideal to access other methods, so I'm thinking of other options
 * (like manually implementing Bluebird.Promisify without needing to depend on Bluebird), but for now, use redis.get
 * to get, redis.exists for exists, and redis.redis.method for any other redis method.
 */
class Redis {
	constructor(redis) {
		this.redis = redis;
	}

	get(key) {
		return new Promise((resolve, reject) => {
			this.redis.get(key, (err, result) => {
				if (err) reject(err);
				else resolve(result);
			});
		});
	}

	exists(key) {
		return new Promise((resolve, reject) => {
			this.redis.exists(key, (err, exists) => {
				if (err) reject(err);
				else resolve(exists);
			});
		});
	}
}

export default Redis;