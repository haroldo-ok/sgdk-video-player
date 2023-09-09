'use strict';

const fs = require('fs');
const path = require('path');

const { changeFileExtension, removeFileExtension } = require('./file');

const movieDataHeaderTemplate = (images, alias) => `
#ifndef _HEADER_${alias}
#define _HEADER_${alias}

#include "movie_player.h"

extern const MovieData ${alias};

#endif // _HEADER_${alias}

`;

const movieDataTemplate = (images, alias) => `
#include "movie_player.h"
#include "${alias}__frames.h"

const MovieData ${alias} = {
	0x01,
	40, 28,
	${images.length},
	
	${alias}__sound,
	sizeof(${alias}__sound),

	{
${images.map(s => `		&${alias}__${removeFileExtension(s)}`).join(',\n')}
	}

};

`;

const movieResourceTemplate = (images, alias) => images
	.map(s => `IMAGE ${alias}__${removeFileExtension(s)} "tmpmv_${alias}/${s}" FAST`)
	.join('\n') + '\n' +
	`WAV ${alias}__sound "tmpmv_${alias}/sound.wav" 2ADPCM` + '\n';


const generateCode = async (images, resDir, alias) => {
	return Promise.all([
		fs.promises.writeFile(path.join(resDir, `${alias}.h`), movieDataHeaderTemplate(images, alias)),
		fs.promises.writeFile(path.join(resDir, `${alias}.c`), movieDataTemplate(images, alias)),
		fs.promises.writeFile(path.join(resDir, `${alias}__frames.res`), movieResourceTemplate(images, alias))
	]);
}

module.exports = { generateCode };