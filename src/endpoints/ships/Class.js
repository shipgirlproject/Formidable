const Endpoint = require('../../struct/Endpoint.js');
const Required = require('../../struct/Required.js');

class Class extends Endpoint {
	constructor(...args) {
		super(...args);
		this.required.set('name', new Required('string'));
	}

	run(query) {
		return this.cache.data.ships.filter(
			ship => ship.class?.toLowerCase() === query.name.toLowerCase()
		);
	}
}

module.exports = Class;
