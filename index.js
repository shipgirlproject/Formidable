const Formidable = require('./src/Formidable.js');
const Server = new Formidable();
Server
    .update()
    .then(() => Server.load().listen(8080))
    .catch(console.error);