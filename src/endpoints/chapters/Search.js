const Endpoint = require('../../struct/Endpoint.js');

class Search extends Endpoint {
    constructor(...args) {
        super(...args);
        this.ratelimit = {
            points: 40,
            duration: 5
        };
        this.query = ['name'];
    }

    run(query) {
        return this.cache.fuse.chapters.search(query[this.query[0]]).shift()?.item;
    }
}

module.exports = Search;
