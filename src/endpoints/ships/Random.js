const Endpoint = require('../../struct/Endpoint.js');

class Random extends Endpoint {
	run() {
		return this.cache.data.ships[Math.random() * this.cache.data.ships.length | 0];
	}
}

module.exports = Random;
