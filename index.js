const Formidable = require('./src/Formidable.js');

new Formidable()
    .load()
    .then(server => server.listen())
    .catch(console.error);