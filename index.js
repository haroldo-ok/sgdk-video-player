#!/usr/bin/env node

'use strict';

const fs = require('fs');
const os = require('os');
const _ = require('underscore');

const { convertVideo } = require('./js/convert');

/* if called directly from command line or from a shell script */
if (require.main === module) {
	const yargs = require('yargs');

	const commandLine = yargs.scriptName('sgdk-video-player')
		.usage('$0 <cmd> [args]')
		.command('convert <src> <destDir>', 'Converts a video file and outputs the result in the destination directory', (yargs) => {
			yargs
				.positional('src', {
					type: 'string',
					describe: 'The source video, the one that will be converted'
				})
				.positional('destDir', {
					type: 'string',
					describe: 'The destination directory, where the output results will be placed'
				})
				.options({
					'cpu-cores': {
						describe: 'Number of CPU cores to use. If ommited, will use all of them.',
						type: 'int'
					}
				})
				.check((argv, options) => {
					if (!fs.existsSync(argv.src)) {
						return `The provided source video file does not exist: ${argv.src}`;
					}
					
					if (!argv.cpuCores) {
						argv.cpuCores = os.cpus().length;
					}
					
					return true;
				});
		})
		.options({
			'imagemagick-dir': {
				alias: 'kd',
				describe: 'Directory where ImageMagick is located',
				type: 'string'
			}
		})
		.demandCommand(1, 'You need to inform at least one command before moving on')
		.strict()
		.help()
		.argv;		
		
	if (commandLine._.includes('convert')) {
		const options = _.pick(commandLine, 'imagemagickDir', 'cpuCores');
		convertVideo(commandLine.src, commandLine.destDir, options);
	}
}

module.exports = { convertVideo };