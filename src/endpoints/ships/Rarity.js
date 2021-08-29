const Endpoint = require('../../struct/Endpoint.js');

class Rarity extends Endpoint {
    constructor(...args) {
        super(...args);
        this.query = ['name'];
    }

    run(query) {
        return this.cache.data.ships.filter(
            ship => ship.rarity?.toLowerCase() === query[this.query[0]].toLowerCase()
        );
    }
}

module.exports = Rarity;