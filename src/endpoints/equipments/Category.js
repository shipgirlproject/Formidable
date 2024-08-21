const Endpoint = require('../../struct/Endpoint.js');
const Required = require('../../struct/Required.js');

class Category extends Endpoint {
	constructor(...args) {
		super(...args);
		this.required.set('name', new Required('string'));
	}

	run(query) {
		return this.cache.data.equipments.filter(
			equip => equip.category?.toLowerCase() === query.name.toLowerCase()
		);
	}
}

module.exports = Category;
