const { readdirSync } = require('fs-extra');

const Os = require('os');
const Server = require('fastify');

const Static = require('@fastify/static');
const Cors = require('@fastify/cors');
const Compress = require('@fastify/compress');

const Pino = require('pino');
const Piscina = require('piscina');
const Path = require('path');

const Limiter = require('./struct/Limiter.js');
const Updater = require('./struct/Updater.js');
const Config = require('./Config.js');

const { abortTimeout } = require('./struct/Utils.js');

class Formidable {
	constructor() {
		this.logger = new Pino(
			{ name: `Formidable [${process.pid}]`, level: Config.level },
			Pino.destination({ sync: false })
		);
		this.pool = new Piscina({
			filename: `${__dirname}/FormidableWorker.js`,
			idleTimeout: 30000,
			minThreads: 0,
			maxThreads: Config.threads === 'auto' ? Os.cpus().length : Config.threads,
			maxQueue: Config.maxQueue
		});
		this.endpoints = [];
		this.pool.on('error', error => this.logger.error(error));
		this.logger.info(`[Server] Using ${this.pool.maxThreads} workers`);
		this.server = Server();
		this.server.addContentTypeParser('*', (_, body, done) => done(null, body));
		this.server
			.register(Static, { root: Path.join(__dirname, '..', 'site') })
			.register(Cors)
			.register(Compress);
	}

	async update() {
		await Updater.Create();
		const outdated = await Updater.Check();
		if (!outdated.length) return;
		await Updater.Update(outdated);
	}

	async handle(command, endpoint, request, reply) {
		try {
			let body = request.query;
			if (!Config.auth && command.locked) {
				this.logger.warn(`[Server] ${endpoint} requires an auth, but user didn't set "auth" on config or AUTH in process enviroment variables`);
			}
			if (Config.auth && command.locked && Config.auth !== request.headers?.authorization) {
				reply.code(401);
				return 'Unauthorized';
			}
			const queueSize = this.pool.queueSize;
			if (queueSize >= this.pool.options.maxQueue) {
				reply.code(503);
				return { message: `Worker queue is full. Has ${queueSize} pending request(s). Please try again later` };
			}
			if (command.method === 'POST') {
				const contentType = request.headers['content-type'];
				if (!contentType?.includes('application/json')) {
					reply.code(415);
					reply.type('application/json');
					return { message: `This method only accepts 'application/json', received: ${contentType}` };
				}
				body = request.body;
			}
			const controller = new AbortController();
			const timeout = setTimeout(() => controller.abort(), abortTimeout).unref();
			const result = await this.pool
				.run({ endpoint, body }, { signal: controller.signal })
				.finally(() => clearTimeout(timeout));
			if (!result.ok) {
				reply.code(400);
				if (command.method === 'POST')
					return { message: 'Required body not found. Body must be application/json, and must contain (refer to required):', required: result.required || null };
				else
					return { message: 'Required query not found. Querystring must contain (refer to required):', required: result.required || null };
			}
			this.logger.debug(`[Endpoints] Endpoint Executed: ${endpoint} | Took ${result.time}ms`);
			reply.type(command.type);
			return Buffer.from(result.data);
		} catch (error) {
			reply.type('application/json');
			this.logger.error(error);
			reply.code(500);
			return { error: error.message };
		}
	}

	sendStats(_, reply) {
		const utilization = this.pool.utilization;
		const status = {
			completed: this.pool.completed,
			utilization: utilization > 100 ? 100 : Math.round(this.pool.utilization),
			memoryRss: process.memoryUsage().rss,
			runTime: this.pool.runTime.average,
			waitime: this.pool.waitTime.average,
			queueSize: this.pool.queueSize,
			uptime: Math.floor(process.uptime())
		};
		reply.type('application/json');
		reply.send(status);
	}

	sendEndpoints(_, reply) {
		reply.type('application/json');
		reply.send(this.endpoints);
	}

	async load() {
		// Check for updates
		this.logger.info('[Server] Checking for latest updates...');
		try {
			await this.update();
			this.logger.info('[Server] Update done');
		} catch (error) {
			this.logger.error(error);
		}
		// Load global ratelimit
		const global = new Limiter(this).global();
		this.logger.info(`[Ratelimits] Global: ${global.options.points} reqs / ${global.options.duration}s`);
		// Load 404 ratelimit
		const notFound = new Limiter(this, { points: 5, duration: 5 }).notFound();
		this.logger.info(`[Ratelimits] 404s: ${notFound.options.points} reqs / ${notFound.options.duration}s`);
		// Load endpoints and their specific ratelimits
		const routes = readdirSync('./src/endpoints', { withFileTypes: true });
		for (const path of routes) {
			// 1st level
			if (path.isFile() && path.name.endsWith('.js')) {
				if (path.name === 'Landing.js') continue;
				const endpoint = `/${path.name.split('.').shift().toLowerCase()}`;
				const command = new (require(`./endpoints/${path.name}`))();
				const ratelimit = new Limiter(this, command.ratelimit);
				ratelimit.route({
					method: command.method,
					url: endpoint,
					handler: (...args) => this.handle(command, endpoint, ...args)
				});
				this.endpoints.push(endpoint);
				this.logger.info(`[Endpoints] Endpoint Loaded: ${endpoint} | [Ratelimits] ${ratelimit.options.points} reqs / ${ratelimit.options.duration}s`);
			} else if (path.isDirectory()) {
				// 2nd level
				const endpoints = readdirSync(`./src/endpoints/${path.name}`, { withFileTypes: true });
				for (const point of endpoints) {
					if (point.isDirectory()) {
						// 3rd level
						const _endpoints = readdirSync(`./src/endpoints/${path.name}/${point.name}`, { withFileTypes: true });
						for (const _point of _endpoints) {
							if (!_point.isFile() || !_point.name.endsWith('.js')) continue;
							const endpoint = `/${path.name}/${point.name}/${_point.name.split('.').shift().toLowerCase()}`;
							const command = new (require(`./endpoints/${path.name}/${point.name}/${_point.name}`))();
							const ratelimit = new Limiter(this, command.ratelimit);
							ratelimit.route({
								method: command.method,
								url: endpoint,
								handler: (...args) => this.handle(command, endpoint, ...args)
							});
							this.endpoints.push(endpoint);
							this.logger.info(`[Endpoints] Endpoint Loaded: ${endpoint} | [Ratelimits] ${ratelimit.options.points} reqs / ${ratelimit.options.duration}s`);
						}
					} else if (point.isFile() && point.name.endsWith('.js')){
						const endpoint = `/${path.name}/${point.name.split('.').shift().toLowerCase()}`;
						const command = new (require(`./endpoints/${path.name}/${point.name}`))();
						const ratelimit = new Limiter(this, command.ratelimit);
						ratelimit.route({
							method: command.method,
							url: endpoint,
							handler: (...args) => this.handle(command, endpoint, ...args)
						});
						this.endpoints.push(endpoint);
						this.logger.info(`[Endpoints] Endpoint Loaded: ${endpoint} | [Ratelimits] ${ratelimit.options.points} reqs / ${ratelimit.options.duration}s`);
					}
				}
			}
		}
		// custom endpoints that dont need workers
		const stats = new Limiter(this);
		stats.route({
			method: 'GET',
			url: '/stats',
			handler: (...args) => this.sendStats(...args)
		});
		this.logger.info(`[Endpoints] Endpoint Loaded: /stats | [Ratelimits] ${stats.options.points} reqs / ${stats.options.duration}s`);
		const endpoints = new Limiter(this);
		endpoints.route({
			method: 'GET',
			url: '/endpoints',
			handler: (...args) => this.sendEndpoints(...args)
		});
		this.logger.info(`[Endpoints] Endpoint Loaded: /endpoints | [Ratelimits] ${stats.options.points} reqs / ${stats.options.duration}s`);
		this.logger.info('[Endpoints] Done loading endpoints!');
		return this;
	}

	async listen() {
		if (!Config.port) this.logger.warn('[Server] User didn\'t set a port, will use a random open port');
		if (!Config.auth) this.logger.warn('[Server] User didn\'t set an auth, locked endpoints will execute without authorization');

		setInterval(() => {
			try {
				this.update();
			} catch (error) {
				this.logger.error(error);
			}
		}, Config.autoUpdateInterval * 60000);
		this.logger.info(`[Server] Checking for updates every ${Config.autoUpdateInterval} min(s)`);

		const address = await this.server.listen({ host: Config.host, port: Config.port });
		this.logger.info(`[Server] Server Loaded, Listening at ${address}`);
	}
}

module.exports = Formidable;
