'use strict';

const { spawn } = require('child_process');

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

module.exports = { executeCommand };