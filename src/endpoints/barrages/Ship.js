const Endpoint = require('../../struct/Endpoint.js');

class Ship extends Endpoint {
    constructor(...args) {
        super(...args);
        this.query = ['name'];
    }

    run(query) {
        return this.cache.data.barrages.filter(data => data.ships.includes(query.name));
    }
}

module.exports = Ship;