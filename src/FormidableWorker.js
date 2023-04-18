const { readdirSync } = require('fs-extra');
const { performance } = require('perf_hooks');
const Shared = require('./struct/Shared.js');
const Cache = require('./struct/Cache.js');

const isIncomplete = (required, input) => {
    const array = Array.from(required.entries());
    /* eslint no-extra-parens: */
    return array.some(([key, req]) => req.type !== (input[key])?.constructor.name.toLowerCase() || req.type === 'array' && req.count !== input[key]?.length);
};
// load global cache
const cache = new Cache();
// Load Routes for this worker
const handlers = new Map();
const routes = readdirSync('./src/endpoints', { withFileTypes: true });
for (const path of routes) {
    if (path.isFile() && path.name.endsWith('.js')) {
        if (path.name === 'Landing.js') continue;
        const endpoint = `/${path.name.split('.').shift().toLowerCase()}`;
        const command = new (require(`./endpoints/${path.name}`))(cache);
        handlers.set(endpoint, command);
    }
    else if (path.isDirectory()) {
        const endpoints = readdirSync(`./src/endpoints/${path.name}`, { withFileTypes: true });
        for (const point of endpoints) {
            if (point.isDirectory()) {
                const _endpoints = readdirSync(`./src/endpoints/${path.name}/${point.name}`, { withFileTypes: true });
                for (const _point of _endpoints) {
                    if (!_point.isFile() || !_point.name.endsWith('.js')) continue;
                    const endpoint = `/${path.name}/${point.name}/${_point.name.split('.').shift().toLowerCase()}`;
                    const command = new (require(`./endpoints/${path.name}/${point.name}/${_point.name}`))(cache);
                    handlers.set(endpoint, command);
                }
            }
            else if (point.isFile() && point.name.endsWith('.js')) {
                const endpoint = `/${path.name}/${point.name.split('.').shift().toLowerCase()}`;
                const command = new (require(`./endpoints/${path.name}/${point.name}`))(cache);
                handlers.set(endpoint, command);
            }
        }
    }
}
// Handler
const handle = async ({ endpoint, body }) => {
    const handler = handlers.get(endpoint);
    if (!handler)
        throw new Error('Endpoint don\'t exist');
    const start = performance.now();
    if (handler.required.size) {
        if (isIncomplete(handler.required, body))
            return { ok: false, required: handler.toString() };
    }
    const result = await handler.run(body);
    let data;
    switch (handler.type) {
        case 'application/json':
            data = JSON.stringify(result, null, 4);
            break;
        case 'text/plain': 
            data = result;
            break;
        default:
            throw new Error('Unknown type');
    }
    const end = performance.now();
    return new Shared({ ok: true, time: Math.round(end - start), data }).notMovable();
};
// Load worker module
const start = async () => {
    await Promise.all([...handlers.values()].map(handler => handler.load()));
    return handle;
};

module.exports = start();
