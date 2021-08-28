const { workerEmit } = require('workerpool');

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
        this.mimeType = 'application/json';
    }

    info(msg) {
        workerEmit(`[${this.type} Pool][Worker ${process.pid}] ${msg}`);
    }
    
    run() {
        throw new Error('Must be extended and implemented');
    }
}

module.exports = Route;