'use strict';

const fs = require('fs');

const { listCodeToGenerate, listImagesToConvert } = require('./generate');
const { checkLastModified } = require('./file');

const isFileAbsentOrChanged = async (baseDate, fileName) => {
	const genDate = await checkLastModified(fileName);
	return !genDate || genDate < baseDate;
}

const isConversionRequired = async (srcVideo, resDir, alias) => {
	const videoDate = await checkLastModified(srcVideo);
	if (!videoDate) {
		throw new Error(`Could not find source video: ${srcVideo}`);
	}
	
	// Check generated source files
	
	for (const { fileName } of listCodeToGenerate(resDir, alias)) {
		if (await isFileAbsentOrChanged(videoDate, fileName)) {
			// Generated file is missing, or is older than the video
			return true;
		}
	}
	
	// Check generated frames	
	const imagesToConvert = await listImagesToConvert(resDir, alias);
	if (!imagesToConvert.length) return true;
	for (const { dest } of imagesToConvert) {
		if (await isFileAbsentOrChanged(videoDate, dest)) {
			// Generated file is missing, or is older than the video
			return true;
		}		
	}
	
	return false;
};

module.exports = { isConversionRequired };