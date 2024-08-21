const Ratelimit = require('./Ratelimit.js');

class Endpoint {
	constructor(cache) {
		this.cache = cache;
		this.method = 'GET';
		this.type = 'application/json';
		this.locked = false;
		this.ratelimit = new Ratelimit();
		this.required = new Map();
	}

	load() {
		return Promise.resolve();
	}

	run() {
		throw new Error('Must be implemented');
	}

	toString() {
		const object = {};
		for (const [ key, value ] of this.required.entries()) object[key] = value.toString();
		return object;
	}
}

module.exports = Endpoint;
