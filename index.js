const Formidable = require('./src/Formidable.js');

(async function main() {
	const client = new Formidable();
	await client.load();
	await client.listen();
})();
