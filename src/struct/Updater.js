const { writeJSONSync, readJSONSync, existsSync, mkdirSync } = require('fs-extra');
const { fetch } = require('../struct/Utils.js');

// constants
const DIRECTORY = './.data';
const FILES = {
    SHIPS: 'Ships.json',
    EQUIPMENTS: 'Equips.json',
    CHAPTERS: 'Chapters.json',
    BARRAGES: 'Barrages.json',
    VOICELINES: 'Voice.json',
    VERSION: 'Version.json'
};
const SEARCH = {
    SHIPS: ['names.en', 'names.jp', 'names.cn', 'names.kr', 'id'],
    EQUIPMENTS: ['names.en', 'names.jp', 'names.cn', 'names.kr', 'id'],
    CHAPTERS: ['names.en', 'names.jp', 'names.cn', 'normal.code'],
    BARRAGES: ['ships', 'name']
};
// idk what to use here tbh, kumo pls help
const URLS = {
    SHIPS: 'https://raw.githubusercontent.com/AzurAPI/azurapi-js-setup/master/dist/ships.json',
    EQUIPMENTS: 'https://raw.githubusercontent.com/AzurAPI/azurapi-js-setup/master/dist/equipments.json',
    CHAPTERS: 'https://raw.githubusercontent.com/AzurAPI/azurapi-js-setup/master/dist/chapters.json',
    BARRAGES: 'https://raw.githubusercontent.com/AzurAPI/azurapi-js-setup/master/dist/barrage.json',
    VOICELINES: 'https://raw.githubusercontent.com/AzurAPI/azurapi-js-setup/master/voice_lines.json',
    VERSION: 'https://raw.githubusercontent.com/AzurAPI/azurapi-js-setup/master/dist/version.json'
};

// non exported functions
const Download = async key => {
    const data = await fetch(URLS[key]);
    const json = JSON.parse(data);
    return {
        key,
        json
    };
};
const ForceUpdate = () => Object.values(FILES).some(file => !Object.keys(readJSONSync(`${DIRECTORY}/${file}`)).length);
// exported functions
const Create = () => {
    if (!existsSync(DIRECTORY)) mkdirSync(DIRECTORY);
    for (const file of Object.values(FILES)) {
        if (existsSync(`${DIRECTORY}/${file}`)) continue;
        writeJSONSync(`${DIRECTORY}/${file}`, {});
    }
};
const Check = async () => {
    if (ForceUpdate()) return Object.keys(FILES);
    const remote = JSON.parse(await fetch(URLS.VERSION));
    const local = readJSONSync(`${DIRECTORY}/${FILES.VERSION}`);
    const outdated = [];
    for (const [ key, value ] of Object.entries(remote)) {
        if (local[key]['version-number'] === value['version-number']) continue;
        outdated.push(key.toUpperCase());
    }
    if (outdated.length) outdated.push('VERSION');
    return outdated;
};
const Update = async outdated => {
    const data = await Promise.all(outdated.map(Download));
    for (const { key, json } of data) {
        if (key === 'CHAPTERS') {
            const modified = [];
            for (const value of json.map(data => Object.values(data)))
                for (const data of value) modified.push(data);
            writeJSONSync(`${DIRECTORY}/${FILES[key]}`, modified, { spaces: 2 });
            continue;
        }
        writeJSONSync(`${DIRECTORY}/${FILES[key]}`, json, { spaces: 2 });
    }
};

// export
module.exports = { DIRECTORY, FILES, SEARCH, URLS, Create, Check, Update };
