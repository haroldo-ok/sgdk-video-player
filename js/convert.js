'use strict';

const fs = require('fs');
const path = require('path');

const { extractVideoFrames } = require('./execute');

const checkFileExists = async fileName => fs.promises.access(fileName, fs.constants.F_OK)
   .then(() => true)
   .catch(() => false);
   
const clearDir = async dir => {
	for (const fileName of await fs.promises.readdir(dir)) {
		await fs.promises.unlink(path.join(dir, fileName));
	}
};

const convertVideo = async (srcVideo, destDir, { imagemagickDir }) => {
	console.log('convertVideo', { srcVideo, destDir, imagemagickDir });
	
	if (!await checkFileExists(srcVideo)) {
		throw new Error(`Input video not found: ${srcVideo}`);
	}

	if (!await checkFileExists(destDir)) {
		await fs.promises.mkdir(destDir, { recursive: true });
	}
	
	await clearDir(destDir);
		
	await extractVideoFrames(srcVideo, destDir, { imagemagickDir });
}

module.exports = { convertVideo };