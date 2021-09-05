const Endpoint = require('../../struct/Endpoint.js');

class Search extends Endpoint {
    constructor(...args) {
        super(...args);
        this.query = ['name'];
        this.ratelimit = {
            points: 40,
            duration: 5
        };
    }

    run(query) {
        const results = this.cache.fuse.barrages.search(query[this.query[0]]);
        if (results.length > this.maxResults) results.length = this.maxResults;
        return results.map(res => res.item);
    }
}

module.exports = Search;
