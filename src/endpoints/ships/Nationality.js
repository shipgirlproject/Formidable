const Endpoint = require('../../struct/Endpoint.js');

class Nationality extends Endpoint {
    constructor(...args) {
        super(...args);
        this.query = ['name'];
    }

    run(query) {
        return this.cache.data.ships.filter(
            ship => ship.nationality?.toLowerCase() === query[this.query[0]].toLowerCase()
        );
    }
}

module.exports = Nationality;