'use strict';

const fs = require('fs');
const path = require('path');

const { spawnWorkers, extractVideoFrames, reduceTileCount, convertImagesToIndexed } = require('./execute');
const { generateCode, getDestDir, listSourceFrames, listImagesToConvert } = require('./generate');
const { checkFileExists, changeFileExtension, clearDir, listFilesRegex } = require('./file');
const { isConversionRequired } = require('./require-conversion');

const convertVideo = async (srcVideo, resDir, { imagemagickDir, cpuCores, alias }) => {

	if (!await checkFileExists(srcVideo)) {
		throw new Error(`Input video not found: ${srcVideo}`);
	}

	const destDir = getDestDir(resDir, alias);
	if (!await checkFileExists(destDir)) {
		await fs.promises.mkdir(destDir, { recursive: true });
	}
			
	console.error('Skipping for testing purposes', { needsConversion: await isConversionRequired(srcVideo, resDir, alias) });
	// return;

	await clearDir(destDir);
		
	await extractVideoFrames(srcVideo, destDir, { imagemagickDir });
	
	const imagesToConvert = await listImagesToConvert(resDir, alias);

	await spawnWorkers(async ({ src, dest }) => {
		console.log(`Converting ${src} to ${dest}...`);
		await reduceTileCount(src, dest);
		console.log(`Finished ${dest}.`);
	}, imagesToConvert, { 
		cpuCores,
		onProgress: ({ percent }) => console.log(`${percent.toFixed(2)}% done: ${srcVideo}`)
	});
	
	await convertImagesToIndexed(destDir, { imagemagickDir });
	
	const sourceFrames = await listSourceFrames(resDir, alias);
	const targetImages = sourceFrames.map(frameSrc => changeFileExtension(frameSrc, '.png'));
	await generateCode(targetImages, resDir, alias);
}

module.exports = { convertVideo };