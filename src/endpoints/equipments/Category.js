const Endpoint = require('../../struct/Endpoint.js');

class Category extends Endpoint {
    constructor(...args) {
        super(...args);
        this.query = ['name'];
    }

    run(query) {
        return this.cache.data.equipments.filter(
            equip => equip.category?.toLowerCase() === query[this.query[0]].toLowerCase()
        );
    }
}

module.exports = Category;