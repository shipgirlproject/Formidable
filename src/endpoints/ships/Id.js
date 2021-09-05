const Endpoint = require('../../struct/Endpoint.js');

class Id extends Endpoint {
    constructor(...args) {
        super(...args);
        this.query = ['code'];
    }

    run(query) {
        return this.cache.data.ships.find(ship => ship.id === query[this.query[0]]);
    }
}

module.exports = Id;
