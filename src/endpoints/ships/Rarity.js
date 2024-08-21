const Endpoint = require('../../struct/Endpoint.js');
const Required = require('../../struct/Required.js');

class Rarity extends Endpoint {
	constructor(...args) {
		super(...args);
		this.required.set('name', new Required('string'));
	}

	run(query) {
		return this.cache.data.ships.filter(
			ship => ship.rarity?.toLowerCase() === query.name.toLowerCase()
		);
	}
}

module.exports = Rarity;
