const Endpoint = require('../struct/Endpoint.js');

class Update extends Endpoint {
	run() {
		return this.cache.data.version;
	}
}

module.exports = Update;
