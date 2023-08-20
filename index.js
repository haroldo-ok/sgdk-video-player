#!/usr/bin/env node

'use strict';

const fs = require('fs');

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
				.check((argv, options) => {
					if (!fs.existsSync(argv.src)) {
						return `The provided source video file does not exist: ${argv.src}`;
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
}
