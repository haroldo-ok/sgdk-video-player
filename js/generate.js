'use strict';

const fs = require('fs');
const path = require('path');

const { removeFileExtension } = require('./file');

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
	
const getDestDir = (resDir, alias) => path.join(resDir, `tmpmv_${alias}`);
	
const listCodeToGenerate = (resDir, alias) => {
	const createEntry = (name, sourceTemplate) => ({
		fileName: path.join(resDir, name),
		sourceTemplate
	});

	return [
		createEntry(`${alias}.h`, movieDataHeaderTemplate),
		createEntry(`${alias}.c`, movieDataTemplate),
		createEntry(`${alias}__frames.res`, movieResourceTemplate)
	];
};


const generateCode = async (images, resDir, alias) => {
	const codeToGenerate = listCodeToGenerate(resDir, alias);
	const codeGenerationPromises = codeToGenerate.map(({ fileName, sourceTemplate }) => 
		fs.promises.writeFile(fileName, sourceTemplate(images, alias)));
	return Promise.all(codeGenerationPromises);
}

module.exports = { generateCode, listCodeToGenerate, getDestDir };