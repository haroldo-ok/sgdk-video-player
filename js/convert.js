'use strict';

const fs = require('fs');

const { executeCommand } = require('./execute');

const checkFileExists = async fileName => fs.promises.access(fileName, fs.constants.F_OK)
   .then(() => true)
   .catch(() => false);

const getCommand = (imagemagickDir, command) => imagemagickDir ? imagemagickDir + '/' + command : command;

const convertVideo = async (srcVideo, destDir, { imagemagickDir }) => {
	console.log('convertVideo', { srcVideo, destDir, imagemagickDir });
	
	if (!await checkFileExists(srcVideo)) {
		throw new Error(`Input video not found: ${srcVideo}`);
	}

	if (!await checkFileExists(destDir)) {
		await fs.promises.mkdir(destDir, { recursive: true });
	}
	
	await executeCommand(getCommand(imagemagickDir, 'ffmpeg'),
		['-i', `"${srcVideo}"`, 
		'-r', 12, 
		'-s', '320x224',
		`"${destDir}/frame_%d.jpg"`,
		'-ar', 22050, 
		'-ac', 1, 
		'-acodec', 'pcm_u8',
		`"${destDir}/sound.wav"`]);
}

module.exports = { convertVideo };