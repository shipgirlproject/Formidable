const { readJSONSync } = require('fs-extra');
const { port, threads } = readJSONSync('./config.json');

const Formidable = require('./src/Formidable.js');

new Formidable(threads)
    .load()
    .then(server => server.listen(port))
    .catch(console.error);