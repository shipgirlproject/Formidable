const { worker } = require('workerpool');
const { readdirSync } = require('fs-extra');

const Cache = require('../struct/Cache.js');

const handlers = new Map();
const cache = new Cache();
const routes = readdirSync('./src/endpoints', { withFileTypes: true });

handlers.set('/formidable.html', new (require('../struct/Landing.js'))(cache));
for (const path of routes) {
    if (path.isFile() && path.name.endsWith('.js')) {
        const endpoint = `/${path.name.split('.').shift().toLowerCase()}`;
        const command = new (require(`../endpoints/${path.name}`))(cache);
        if (command.type !== 'READ') continue;
        handlers.set(endpoint, command);
    }
    else if (path.isDirectory()) {
        const endpoints = readdirSync(`./src/endpoints/${path.name}`, { withFileTypes: true });
        for (const point of endpoints) {
            if (!point.isFile() || !point.name.endsWith('.js')) continue;
            const endpoint = `/${path.name}/${point.name.split('.').shift().toLowerCase()}`;
            const command = new (require(`../endpoints/${path.name}/${point.name}`))(cache);
            if (command.type !== 'READ') continue;
            handlers.set(endpoint, command);
        }
    }
}

const handle = (endpoint, query) => {
    const handler = handlers.get(endpoint);
    if (!handler) throw new Error('Unsupported handler');
    const start = Date.now();
    const data = handler.run(query);
    handler.info(`Handler ${endpoint} executed | Took ${Date.now() - start}ms to process`);
    // mimeType return thing for future things
    switch (handler.mimeType) {
        case 'application/json': return JSON.stringify(data, null, 4);
        case 'text/html':
        case 'text/plain': return data;
        default: throw new Error(`Unsupported mimeType ${handler.mimeType} for ${endpoint}`);
    }
};

worker({ handle });