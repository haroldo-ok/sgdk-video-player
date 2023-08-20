#!/usr/bin/env node

'use strict';

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
				});
		})
		.demandCommand(1, 'You need to inform at least one command before moving on')
		.strict()
		.help()
		.argv;		
}
