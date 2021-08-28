const Pino = require('pino');

const { readJSONSync } = require('fs-extra');
const { level } = readJSONSync('./config.json');

class Logger extends Pino {
    constructor() {
        super({ name: `Formidable [${process.pid}]`, level: level || 'info' }, Pino.destination({ sync: false }));
        this.level = level;
    }
}

module.exports = Logger;