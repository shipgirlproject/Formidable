const Updater = require('../struct/Updater.js');
const Endpoint = require('../struct/Endpoint.js');
const Ratelimit = require('../struct/Ratelimit.js');

class Update extends Endpoint {
	constructor(...args) {
		super(...args);
		this.ratelimit = new Ratelimit(1, 120);
		this.method = 'POST';
		this.locked = true;
		this.mimeType = 'text/plain';
	}

	async run() {
		await Updater.Create();
		const outdated = await Updater.Check();
		if (!outdated.length) {
			const msg = 'Data is up to date!';
			this.info(msg);
			return msg;
		}
		await Updater.Update(outdated);
		const msg = 'Not up to date, data updated!';
		this.info(msg);
		return msg;
	}
}

module.exports = Update;
