const port = !isNaN(Number(process.env.PORT)) ? Number(process.env.PORT) : 1024;
const distance = !isNaN(Number(process.env.DISTANCE)) ? Number(process.env.DISTANCE) : 0.5;
const threads = !isNaN(Number(process.env.THREADS)) ? Number(process.env.THREADS) : 'auto';
const maxQueue = !isNaN(Number(process.env.MAX_QUEUE)) ? Number(process.env.MAX_QUEUE) : 'auto';
const maxResults = !isNaN(Number(process.env.MAX_RESULTS)) ? Number(process.env.MAX_RESULTS) : 10;
const autoUpdateInterval = !isNaN(Number(process.env.AUTO_UPDATE_INTERVAL)) ? Number(process.env.AUTO_UPDATE_INTERVAL) : 10;

module.exports = {
	level: process.env.LEVEL ?? 'info',
	host: process.env.HOST ?? '0.0.0.0',
	auth: process.env.AUTH,
	port,
	distance,
	threads,
	maxQueue,
	maxResults,
	autoUpdateInterval
};
