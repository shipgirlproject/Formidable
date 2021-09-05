const { RateLimiterMemory } = require('rate-limiter-flexible');

class Ratelimiter {
    // Default ratelimit: 20 req / 1s
    constructor(formidable, options = { points: 100, duration: 5 }) {
        this.formidable = formidable;
        this.options = options;
        this.manager = new RateLimiterMemory(options);
    }

    get server() {
        return this.formidable.server;
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
            reply.code(429);
            throw 'You are being ratelimited';
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

module.exports = Ratelimiter;
