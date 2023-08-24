'use strict';

const fs = require('fs');
const path = require('path');

// TODO: Move to utility module
const changeFileExtension = (file, extension) => {
  const baseName = path.basename(file, path.extname(file))
  return path.join(path.dirname(file), baseName + extension);
};

const removeFileExtension = file => changeFileExtension(file, '');

const movieDataTemplate = (images, alias) => `
#include "movie_res.h"
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
		fs.promises.writeFile(path.join(resDir, `${alias}.c`), movieDataTemplate(images, alias)),
		fs.promises.writeFile(path.join(resDir, `${alias}__frames.res`), movieResourceTemplate(images, alias))
	]);
}

module.exports = { generateCode };