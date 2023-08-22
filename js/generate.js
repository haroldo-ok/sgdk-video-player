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
#include "movie_frames.h"

const MovieData ${alias} = {
	${images.length},

	{
${images.map(s => `		&${alias}_${removeFileExtension(s)}`).join(',\n')}
	}

};

`;

const generateCode = async (images, destDir, alias) => {
	return Promise.all([
		fs.promises.writeFile(path.join(destDir, 'movie_res.c'), movieDataTemplate(images, alias))
	]);
}

module.exports = { generateCode };