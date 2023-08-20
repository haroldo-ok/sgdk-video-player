'use strict';

const fs = require('fs');

const checkFileExists = async fileName => fs.promises.access(fileName, fs.constants.F_OK)
   .then(() => true)
   .catch(() => false);


const convertVideo = async (srcVideo, destDir, options) => {
	console.log('convertVideo', { srcVideo, destDir, options });
	
	if (!await checkFileExists(srcVideo)) {
		throw new Error(`Input video not found: ${srcVideo}`);
	}

	if (!await checkFileExists(destDir)) {
		await fs.promises.mkdir(destDir, { recursive: true });
	}
}

module.exports = { convertVideo };