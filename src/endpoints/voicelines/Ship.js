const Endpoint = require('../../struct/Endpoint.js');

class Ship extends Endpoint {
    constructor(...args) {
        super(...args);
        this.query = ['id'];
    }

    run(query) {
        return this.cache.data.voicelines[query.id] || null;
    }
}

module.exports = Ship;