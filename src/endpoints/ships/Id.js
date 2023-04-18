const Endpoint = require('../../struct/Endpoint.js');
const Required = require('../../struct/Required.js');

class Id extends Endpoint {
    constructor(...args) {
        super(...args);
        this.required.set('code', new Required('string'));
    }

    run(query) {
        return this.cache.data.ships.find(ship => ship.id === query.code);
    }
}

module.exports = Id;
