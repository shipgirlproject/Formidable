const { readFileSync, watchFile } = require('fs-extra');

const Endpoint = require('../struct/Endpoint.js');

class Landing extends Endpoint {
    constructor(...args) {
        super(...args);
        this.mimeType = 'text/html';
        this.cache = readFileSync('./src/landing/formidable.html').toString();
        watchFile('./src/landing/formidable.html', () => { 
            this.cache = readFileSync('./src/landing/formidable.html').toString();
        });
    }
    
    run() {
        return this.cache;
    }
}

module.exports = Landing;