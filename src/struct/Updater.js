const { writeJSON, readJSON, exists, mkdir } = require('fs-extra');
const Axios = require('axios');

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
	SHIPS: [ 'names.en', 'names.jp', 'names.cn', 'names.kr', 'id' ],
	EQUIPMENTS: [ 'names.en', 'names.jp', 'names.cn', 'names.kr', 'id' ],
	CHAPTERS: [ 'names.en', 'names.jp', 'names.cn', 'normal.code' ],
	BARRAGES: [ 'ships', 'name' ]
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

const Download = async key => {
	const response = await Axios.get(URLS[key]);
	return {
		key,
		json: response.data
	};
};

const ForceUpdate = async () => {
	const results = await Promise.all(Object.values(FILES).map(async (file) => {
		const keys = await readJSON(`${DIRECTORY}/${file}`);
		return Object.keys(keys).length === 0;
	}));
	return results.some(Boolean);
};

const Create = async () => {
	const directoryExists = await exists(DIRECTORY);
	if (!directoryExists) {
		await mkdir(DIRECTORY);
	}
	await Promise.all(Object.values(FILES).map(async (file) => {
		const fileExists = await exists(`${DIRECTORY}/${file}`);
		if (fileExists) return;
		await writeJSON(`${DIRECTORY}/${file}`, {});
	}));
};

const Check = async () => {
	const shouldForceUpdate = await ForceUpdate();
	if (shouldForceUpdate) return Object.keys(FILES);

	const response = await Axios.get(URLS.VERSION);
	const remote = response.data;
	const local = await readJSON(`${DIRECTORY}/${FILES.VERSION}`);

	const outdated = [];
	for (const [ key, value ] of Object.entries(remote)) {
		if (local[key]['version-number'] === value['version-number']) continue;
		outdated.push(key.toUpperCase());
	}
	if (outdated.length) outdated.push('VERSION');

	return outdated;
};

const Update = async outdated => {
	const downloaded = await Promise.all(outdated.map(Download));
	await Promise.all(downloaded.map(async ({ key, json }) => {
		let data = json;
		if (key === 'CHAPTERS') {
			data = [];
			for (const values of json.map(data => Object.values(data))) {
				data.push(...values);
			}
		}
		await writeJSON(`${DIRECTORY}/${FILES[key]}`, data, { spaces: 2 });
	}));
};

// export
module.exports = { DIRECTORY, FILES, SEARCH, URLS, Create, Check, Update };
