const Https = require('https');
const { cpus } = require('os');
const { readJSONSync } = require('fs-extra');
const { threads, maxQueue } = readJSONSync('./config.json');

module.exports = {
    workers: isNaN(threads) ? Math.floor(50 * cpus().length / 100) : Number(threads),
    maxQueue: maxQueue || 'auto',
    abortTimeout: 10000,
    fetch: (url, options) => new Promise((resolve, reject) => {
        const request = Https.request(url, options, response => {
            const chunks = [];
            response.on('data', chunk => chunks.push(chunk));
            response.on('error', reject);
            response.on('end', () => {
                const code = response.statusCode ?? 500;
                const body = chunks.join('');
                if (code >= 200 && code <= 299)
                    resolve(body);
                else
                    reject(new Error(`Response received is not ok, Status Code: ${response.statusCode}, body: ${body}`));
            });
        });
        request.on('error', reject);
        request.end();
    })
};
