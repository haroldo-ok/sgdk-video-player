'use strict';

const fs = require('fs');

const { listCodeToGenerate } = require('./generate');
const { checkLastModified } = require('./file');

const isConversionRequired = async (srcVideo, resDir, alias) => {
	const videoDate = await checkLastModified(srcVideo);
	if (!videoDate) {
		throw new Error(`Could not find source video: ${srcVideo}`);
	}
	
	// Check generated source files
	for (const { fileName } of listCodeToGenerate(resDir, alias)) {
		const genDate = await checkLastModified(fileName);
		if (!genDate || genDate < videoDate) {
			// Generated file is missing, or is older than the video
			return true;
		}
	}
	
	return false;
};

module.exports = { isConversionRequired };