const Endpoint = require('../../struct/Endpoint.js');
const Required = require('../../struct/Required.js');

class Ship extends Endpoint {
    constructor(...args) {
        super(...args);
        this.required.set('id', new Required('string'));
    }

    run(query) {
        return this.cache.data.voicelines[query.id] || null;
    }
}

module.exports = Ship;