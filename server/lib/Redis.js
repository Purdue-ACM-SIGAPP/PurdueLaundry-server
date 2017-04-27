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

module.exports = Redis;