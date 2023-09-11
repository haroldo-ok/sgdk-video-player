'use strict';

const fs = require('fs');
const path = require('path');

const { spawnWorkers, extractVideoFrames, reduceTileCount, convertImagesToIndexed } = require('./execute');
const { generateCode } = require('./generate');
const { checkFileExists, changeFileExtension, clearDir, listFilesRegex } = require('./file');
const { isConversionRequired } = require('./require-conversion');

const convertVideo = async (srcVideo, resDir, { imagemagickDir, cpuCores, alias }) => {

	if (!await checkFileExists(srcVideo)) {
		throw new Error(`Input video not found: ${srcVideo}`);
	}

	const destDir = path.join(resDir, `tmpmv_${alias}`);
	if (!await checkFileExists(destDir)) {
		await fs.promises.mkdir(destDir, { recursive: true });
	}
			
	console.error('Skipping for testing purposes', { needsConversion: await isConversionRequired(srcVideo, resDir, alias) });
	return;

	await clearDir(destDir);
		
	await extractVideoFrames(srcVideo, destDir, { imagemagickDir });
	
	const sourceFrames = await listFilesRegex(destDir, /^frame_(\d+)\.jpg$/);

	const tileCountJobs = sourceFrames.map(frameSrc => {
		const fullSrc = path.join(destDir, frameSrc);
		const dest = changeFileExtension(fullSrc, '.png');
		
		return { src: fullSrc, dest };
	});

	await spawnWorkers(async ({ src, dest }) => {
		console.log(`Converting ${src} to ${dest}...`);
		await reduceTileCount(src, dest);
		console.log(`Finished ${dest}.`);
	}, tileCountJobs, { 
		cpuCores,
		onProgress: ({ percent }) => console.log(`${percent.toFixed(2)}% done: ${srcVideo}`)
	});
	
	await convertImagesToIndexed(destDir, { imagemagickDir });
	
	const targetImages = sourceFrames.map(frameSrc => changeFileExtension(frameSrc, '.png'));
	await generateCode(targetImages, resDir, alias);
}

module.exports = { convertVideo };