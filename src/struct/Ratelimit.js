class Ratelimit {
	constructor(points, duration) {
		this.points = points || 50;
		this.duration = duration || 5;
	}
}

module.exports = Ratelimit;
