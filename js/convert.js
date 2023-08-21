'use strict';

const fs = require('fs');
const path = require('path');

const { extractVideoFrames, reduceTileCount } = require('./execute');

const checkFileExists = async fileName => fs.promises.access(fileName, fs.constants.F_OK)
   .then(() => true)
   .catch(() => false);
   
const clearDir = async dir => {
	for (const fileName of await fs.promises.readdir(dir)) {
		await fs.promises.unlink(path.join(dir, fileName));
	}
};

const listFilesRegex = async (dir, fileRegex) => {
	const allFiles = await fs.promises.readdir(dir);
	const fileNames = allFiles.filter(s => fileRegex.test(s));
	const sortedFileNames = fileNames
		.map(name => ({ idx: parseInt(fileRegex.exec(name)[1]), name }))
		.sort((a, b) => a.idx - b.idx)
		.map(o => o.name);
		
	return sortedFileNames;
};

const convertVideo = async (srcVideo, destDir, { imagemagickDir, cpuCores }) => {

	if (!await checkFileExists(srcVideo)) {
		throw new Error(`Input video not found: ${srcVideo}`);
	}

	if (!await checkFileExists(destDir)) {
		await fs.promises.mkdir(destDir, { recursive: true });
	}
	
	await clearDir(destDir);
		
	await extractVideoFrames(srcVideo, destDir, { imagemagickDir });
	
	const sourceFrames = await listFilesRegex(destDir, /^frame_(\d+)\.jpg$/);
	await reduceTileCount(
		path.join(destDir, sourceFrames[30]),
		path.join(destDir, 'test.png'));
}

module.exports = { convertVideo };