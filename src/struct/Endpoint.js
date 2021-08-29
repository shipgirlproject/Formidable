const { readJSONSync } = require('fs-extra');
const { workerEmit } = require('workerpool');
const { maxResults } = readJSONSync('./config.json');

class Route {
    constructor(cache) {
        this.cache = cache;
        this.ratelimit = { 
            points: 100, 
            duration: 5 
        };
        this.type = 'READ';
        this.method = 'GET';
        this.query = [];
        this.locked = false;
        this.mimeType = 'application/json';
    }

    get maxResults() {
        return maxResults || 10;
    }

    info(msg) {
        workerEmit(`[${this.type} thread][Worker ${process.pid}] ${msg}`);
    }
    
    run() {
        throw new Error('Must be extended and implemented');
    }
}

module.exports = Route;