'use strict';

const fs = require('fs');
const path = require('path');

const { spawnWorkers, extractVideoFrames, reduceTileCount, convertImagesToIndexed } = require('./execute');
const { generateCode } = require('./generate');

const checkFileExists = async fileName => fs.promises.access(fileName, fs.constants.F_OK)
   .then(() => true)
   .catch(() => false);
   
const changeFileExtension = (file, extension) => {
  const baseName = path.basename(file, path.extname(file))
  return path.join(path.dirname(file), baseName + extension);
};
   
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

const convertVideo = async (srcVideo, resDir, { imagemagickDir, cpuCores, alias }) => {

	if (!await checkFileExists(srcVideo)) {
		throw new Error(`Input video not found: ${srcVideo}`);
	}

	const destDir = path.join(resDir, `tmpmv_${alias}`);
	if (!await checkFileExists(destDir)) {
		await fs.promises.mkdir(destDir, { recursive: true });
	}

	/* FIXME: Disabled for testing
	await clearDir(destDir);
		
	await extractVideoFrames(srcVideo, destDir, { imagemagickDir });
	*/
	
	const sourceFrames = await listFilesRegex(destDir, /^frame_(\d+)\.jpg$/);

	/* FIXME: Disabled for testing
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
	*/
	
	await convertImagesToIndexed(destDir, { imagemagickDir });
	
	const targetImages = sourceFrames.map(frameSrc => changeFileExtension(frameSrc, '.png'));
	await generateCode(targetImages, destDir, alias);
}

module.exports = { convertVideo };