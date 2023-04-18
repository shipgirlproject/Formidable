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
        return this.cache.fuse.chapters.search(query.name).shift()?.item;
    }
}

module.exports = Search;
