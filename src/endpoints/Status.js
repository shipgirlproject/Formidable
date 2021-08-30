const Endpoint = require('../struct/Endpoint.js');

class Status extends Endpoint {
    run() {
        return {
            memory: process.memoryUsage.rss(),
            uptime: Math.floor(process.uptime())
        };
    }
}

module.exports = Status;