const Endpoint = require('../../struct/Endpoint.js');
const Ratelimit = require('../../struct/Ratelimit.js');
const Required = require('../../struct/Required.js');

class Search extends Endpoint {
    constructor(...args) {
        super(...args);
        this.ratelimit = new Ratelimit(25, 5);
        this.required.set('name', new Required('string'));
    }

    run(query) {
        const results = this.cache.fuse.ships.search(query.name);
        if (results.length > this.maxResults) results.length = this.maxResults;
        return results.map(res => res.item);
    }
}

module.exports = Search;
