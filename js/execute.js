'use strict';

const { spawn } = require('child_process');

const getCommand = (imagemagickDir, command) => imagemagickDir ? imagemagickDir + '/' + command : command;

const executeCommand = async (command, args, {} = {}) => new Promise((resolve, reject) => {
	const process = spawn(command, args, { shell: true });
	process.stdout.on('data', (data) => {
		console.log(data.toString());
	});
	process.stderr.on('data', (data) => {
		console.error(data.toString());
	});
	process.on('exit', (code) => {
		if (code) {
			reject(new Error(`Child returned error code ${code}`));
		} else {
			resolve();
		}
	});
	process.on('error', (e) => {
		reject(e);
	});
});

const extractVideoFrames = async (srcVideo, destDir, { imagemagickDir }) => executeCommand(
	getCommand(imagemagickDir, 'ffmpeg'),
	['-i', `"${srcVideo}"`, 
	'-r', 12, 
	'-s', '320x224',
	`"${destDir}/frame_%d.jpg"`,
	'-ar', 22050, 
	'-ac', 1, 
	'-acodec', 'pcm_u8',
	`"${destDir}/sound.wav"`]);


module.exports = { executeCommand, extractVideoFrames };