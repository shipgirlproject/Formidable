const Endpoint = require('../../struct/Endpoint.js');

class Nationality extends Endpoint {
    constructor(...args) {
        super(...args);
        this.query = ['name'];
    }

    run(query) {
        return this.cache.data.equipments.filter(
            equip => equip.nationality?.toLowerCase() === query[this.query[0]].toLowerCase()
        );
    }
}

module.exports = Nationality;