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
		.command('convert <src> <resDir>', 'Converts a video file and outputs the result in the resource directory', (yargs) => {
			yargs
				.positional('src', {
					type: 'string',
					describe: 'The source video, the one that will be converted'
				})
				.positional('resDir', {
					type: 'string',
					describe: 'The resource directory, where the generated sources will be placed.'
				})
				.options({
					'cpu-cores': {
						describe: 'Number of CPU cores to use. If ommited, will use all of them.',
						type: 'int'
					},
					'alias': {
						describe: 'Alias to use when generating the C constants. If ommited, it will be generated from <src>.',
						type: 'string'
					},
					'only-if-changed': {
						describe: 'Only converts if file has been changed.',
						default: false,
						type: 'boolean'
					}
				})
				.check((argv, options) => {
					if (!fs.existsSync(argv.src)) {
						return `The provided source video file does not exist: ${argv.src}`;
					}
					
					if (!argv.cpuCores) {
						argv.cpuCores = os.cpus().length;
					}
					
					if (!argv.alias) {
						argv.alias = 'movie_' + argv.src.replace(/[^A-Za-z0-9]/g, '_').replace(/__+/g, '_');
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
		const options = _.pick(commandLine, 'imagemagickDir', 'cpuCores', 'alias');
		convertVideo(commandLine.src, commandLine.resDir, options);
	}
}

module.exports = { convertVideo };