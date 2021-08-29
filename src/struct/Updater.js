const { writeJSONSync, readJSONSync, existsSync, mkdirSync } = require('fs-extra');

const Fetch = require('sync-fetch');

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
const URLS = {
    SHIPS: 'https://raw.githubusercontent.com/AzurAPI/azurapi-js-setup/master/ships.json',
    EQUIPMENTS: 'https://raw.githubusercontent.com/AzurAPI/azurapi-js-setup/master/equipments.json',
    CHAPTERS: 'https://raw.githubusercontent.com/AzurAPI/azurapi-js-setup/master/chapters.json',
    BARRAGES: 'https://raw.githubusercontent.com/AzurAPI/azurapi-js-setup/master/barrage.json',
    VOICELINES: 'https://raw.githubusercontent.com/AzurAPI/azurapi-js-setup/master/voice_lines.json',
    VERSION: 'https://raw.githubusercontent.com/AzurAPI/azurapi-js-setup/master/version-info.json'
};

// functions
const Create = () => {
    if (!existsSync(DIRECTORY)) mkdirSync(DIRECTORY);
    for (const file of Object.values(FILES)) {
        if (existsSync(`${DIRECTORY}/${file}`)) continue;
        writeJSONSync(`${DIRECTORY}/${file}`, {});
    }
};
const Force = () => Object.values(FILES).some(file => !Object.keys(readJSONSync(`${DIRECTORY}/${file}`)).length);
const Check = () => {
    if (Force()) return Object.keys(FILES);
    const remote = Fetch(URLS.VERSION).json();
    const local = readJSONSync(`${DIRECTORY}/${FILES.VERSION}`);
    const outdated = [];
    for (const [ key, value ] of Object.entries(remote)) {
        if (local[key]['version-number'] === value['version-number']) continue;
        outdated.push(key.toUpperCase());
    }
    if (outdated.length) outdated.push('VERSION');
    return outdated;
};
const Update = outdated => {
    const data = outdated.map(key => {
        return {
            key,
            json: Fetch(URLS[key]).json()
        };
    });
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
module.exports = { DIRECTORY, FILES, SEARCH, URLS, Create, Force, Check, Update };