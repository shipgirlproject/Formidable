const Server = require('fastify');
const Ratelimiter = require('./ratelimit/Ratelimiter.js');
const Logger = require('./logger/Logger.js');

const { readdirSync } = require('fs-extra');
const { pool } = require('workerpool');

class Formidable {
    constructor() {
        this.logger = new Logger();
        this.server = Server();
        this.read = pool(`${__dirname}/worker/FormidableReader.js`, { minWorkers: 12, maxWorkers: 12, workerType: 'threads' });
        this.write = pool(`${__dirname}/worker/FormidableWriter.js`, { minWorkers: 1, maxWorkers: 1, maxQueueSize: 1, workerType: 'process' });
        this.logger.info(`[Server] Worker pool loaded! Using ${this.read.workerType} for read workers and ${this.write.workerType} for write worker`);
    }

    async handle(command, endpoint, request, reply) {
        try {
            if (command.query.length && !command.query.some(query => request.query[query])) {
                reply.code(400);
                return `This endpoint needs ${command.query.join(', ')} as a query string`;
            }
            if (command.type === 'READ') {
                const result = await this.read.exec('handle', [ endpoint, request.query ], { on: msg => this.logger.debug(msg) });
                reply.type(command.mimeType);
                return result;
            } else {
                if (endpoint === 'update') {
                    await this.update();
                    return 'OK';
                } else {
                    const result = await this.write.exec('handle', [ endpoint, request.query ], { on: msg => this.logger.debug(msg) });
                    reply.type(command.mimeType);
                    return result || 'OK';
                }
            }
        } catch (error) {
            this.logger.error(error);
            reply.code(500);
            return error.message;
        }
    }

    update() {
        return this.write.exec('handle', ['/update'], { on: msg => this.logger.info(msg) });
    }

    load() { 
        // Load global ratelimit 
        const global = new Ratelimiter(this).global();
        this.logger.info(`[Ratelimits] Global: ${global.options.points} reqs / ${global.options.duration}s`);
        // Load 404 ratelimit
        const notFound = new Ratelimiter(this, { points: 5, duration: 5 }).notFound();
        this.logger.info(`[Ratelimits] 404s: ${notFound.options.points} reqs / ${notFound.options.duration}s`);
        // Load endpoints and their specific ratelimits
        const routes = readdirSync('./src/endpoints', { withFileTypes: true });
        for (const path of routes) {
            if (path.isFile() && path.name.endsWith('.js')) {
                const endpoint = `/${path.name.split('.').shift().toLowerCase()}`;
                const command = new (require(`./endpoints/${path.name}`))();
                const ratelimit = new Ratelimiter(this, command.ratelimit);
                ratelimit.route({
                    method: command.method,
                    url: endpoint,
                    handler: (...args) => this.handle(command, endpoint, ...args)
                });
                this.logger.info(`[Endpoints] Endpoint Loaded: ${endpoint} | [Ratelimits] ${ratelimit.options.points} reqs / ${ratelimit.options.duration}s`);
            }
            else if (path.isDirectory()) {
                const endpoints = readdirSync(`./src/endpoints/${path.name}`, { withFileTypes: true });
                for (const point of endpoints) {
                    if (!point.isFile() || !point.name.endsWith('.js')) continue;
                    const endpoint = `/${path.name}/${point.name.split('.').shift().toLowerCase()}`;
                    const command = new (require(`./endpoints/${path.name}/${point.name}`))();
                    const ratelimit = new Ratelimiter(this, command.ratelimit);
                    ratelimit.route({
                        method: command.method,
                        url: endpoint,
                        handler: (...args) => this.handle(command, endpoint, ...args)
                    });
                    this.logger.info(`[Endpoints] Endpoint Loaded: ${endpoint} | [Ratelimits] ${ratelimit.options.points} reqs / ${ratelimit.options.duration}s`);
                }
            }
        }
        this.logger.info('[Endpoints] Done loading endpoints!');
        return this;
    }

    async listen(port) {
        const address = await this.server.listen(port);
        this.logger.info(`[Server] Server Loaded, Listening at ${address}`);
    }
}

module.exports = Formidable;