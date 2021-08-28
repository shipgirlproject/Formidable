const { worker } = require('workerpool');
const { readdirSync } = require('fs-extra');

const handlers = new Map();
const routes = readdirSync('./src/endpoints', { withFileTypes: true });

for (const path of routes) {
    if (path.isFile() && path.name.endsWith('.js')) {
        const endpoint = `/${path.name.split('.').shift().toLowerCase()}`;
        const command = new (require(`../endpoints/${path.name}`))();
        if (command.type !== 'WRITE') continue;
        handlers.set(endpoint, command);
    }
    else if (path.isDirectory()) {
        const endpoints = readdirSync(`./src/endpoints/${path.name}`, { withFileTypes: true });
        for (const point of endpoints) {
            if (!point.isFile() || !point.name.endsWith('.js')) continue;
            const endpoint = `/${path.name}/${point.name.split('.').shift().toLowerCase()}`;
            const command = new (require(`../endpoints/${path.name}/${point.name}`))();
            if (command.type !== 'WRITE') continue;
            handlers.set(endpoint, command);
        }
    }
}

const handle = (endpoint, query) => {
    const handler = handlers.get(endpoint);
    if (!handler) throw new Error('Unsupported handler');
    const start = Date.now();
    const data = handler.run(query);
    handler.info(`${endpoint} executed | Took ${Date.now() - start}ms`);
    switch (handler.mimeType) {
        case 'application/json': return JSON.stringify(data, null, 4);
        case 'text/plain': return data;
        default: throw new Error(`Unsupported mimeType ${handler.mimeType} for ${endpoint}`);
    }
};

worker({ handle });