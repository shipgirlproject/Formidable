const { readJSONSync } = require('fs-extra');
const config = readJSONSync('./config.json');
const Formidable = require('./src/Formidable.js');

const host = process.env.HOST ?? config.host ?? '0.0.0.0';
const port = process.env.PORT ?? config.port;

new Formidable()
    .load()
    .listen(host, port);