const Updater = require('../struct/Updater.js');
const Endpoint = require('../struct/Endpoint.js');

class Update extends Endpoint {
    constructor(...args) {
        super(...args);
        this.ratelimit = { 
            points: 1, 
            duration: 120
        };
        this.type = 'WRITE';
        this.method = 'POST';
        this.locked = true;
        this.mimeType = 'text/plain';
    }

    run() {
        Updater.Create();
        const outdated = Updater.Check();
        if (!outdated.length) return 'OK';
        Updater.Update(outdated);
        return 'OK';
    }
}

module.exports = Update;