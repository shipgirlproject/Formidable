const { watchFile } = require('fs');
const { readJSONSync } = require('fs-extra');
const { FILES, SEARCH, DIRECTORY, Create } = require('./Updater.js');

const Config = require('../Config.js');

const Fuse = require('fuse.js');

class Cache {
    constructor() {
        this.data = {};
        this.fuse = {};
        this.listening = false;
        for (const [ key, file ] of Object.entries(FILES)) this.update(key, `${DIRECTORY}/${file}`);
        this.monitor();
    }
    
    get version() {
        return this.data[FILES.VERSION.toLowerCase()];
    }

    update(key, directory) {
        // makes sure data exists
        Create();
        // read data
        const data = readJSONSync(directory);
        // do not update internal data if local files is empty
        if (!Object.keys(data || {}).length) return;
        this.data[key.toLowerCase()] = data;
        const keys = SEARCH[key];
        if (!keys) return;
        const dist = Config.distance;
        this.fuse[key.toLowerCase()] = new Fuse(this.data[key.toLowerCase()], { keys, distance: dist });
    }

    monitor() {
        if (this.listening) return;
        for (const [ key, file ] of Object.entries(FILES)) 
            watchFile(`${DIRECTORY}/${file}`, () => this.update(key, `${DIRECTORY}/${file}`));
        this.listening = true;
    }
}

module.exports = Cache;