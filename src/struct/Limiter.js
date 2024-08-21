const { RateLimiterMemory } = require('rate-limiter-flexible');

class Limiter {
	// Default global ratelimit, 50 req / 5s
	constructor(nagato, options = { points: 50, duration: 5 }) {
		this.nagato = nagato;
		this.options = options;
		this.manager = new RateLimiterMemory(options);
	}

	get server() {
		return this.nagato.server;
	}

	createHeaders(RateLimiterResponse) {
		return {
			'Retry-After': RateLimiterResponse.msBeforeNext / 1000,
			'X-RateLimit-Limit': this.options.points,
			'X-RateLimit-Remaining': RateLimiterResponse.remainingPoints,
			'X-RateLimit-Reset': (Date.now() + RateLimiterResponse.msBeforeNext) / 1000
		};
	}

	async execute(request, reply) {
		try {
			const RateLimiterResponse = await this.manager.consume(request.ip);
			reply.headers(this.createHeaders(RateLimiterResponse));
		} catch (RateLimiterResponse) {
			reply.headers(this.createHeaders(RateLimiterResponse));
			reply.type('application/json');
			reply.code(429);
			throw { message: 'You are being ratelimited!' };
		}
	}

	global() {
		this.server.addHook('onRequest', (...args) => this.execute(...args));
		return this;
	}

	route(options) {
		if (!options) throw new Error('Options not supplied');
		options.onRequest = (...args) => this.execute(...args);
		this.server.route(options);
		return this;
	}

	notFound() {
		this.server.setNotFoundHandler({ onRequest: (...args) => this.execute(...args) });
		return this;
	}
}

module.exports = Limiter;
