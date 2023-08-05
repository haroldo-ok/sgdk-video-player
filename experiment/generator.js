const fs = require('fs');
//fs.readdirSync('tmpmv_test');
//parseInt(/^\w+_(\d+)\.png$/.exec('frame_142.png')[1])
const MOVIE_DIR = 'tmpmv_test/';
const GENSRC_DIR = 'src/generated/';

const FILE_REGEX = /^\w+_(\d+)\.png$/;
const fileNames = fs.readdirSync(MOVIE_DIR).filter(s => FILE_REGEX.test(s));
const sortedFileNames = fileNames
	.map(name => ({ idx: parseInt(FILE_REGEX.exec(name)[1]), name }))
	.sort((a, b) => a.idx - b.idx)
	.map(o => o.name);
	
if (!fs.existsSync(GENSRC_DIR)) {
	fs.mkdirSync(GENSRC_DIR, { recursive: true });
}

fs.writeFileSync(`${GENSRC_DIR}/movie_res.h`, `
#ifndef _MOVIE_RES_H
#define _MOVIE_RES_H

#include <genesis.h>

typedef struct MovieData {
	u16 frameCount,
	Image *frames[];
} MovieData;

extern const MovieData movie_test;

#endif _MOVIE_RES_H
`);

fs.writeFileSync(`${GENSRC_DIR}/movie_res.c`, `
#include "movie_res.h"

const MovieData movie_test = {
	${sortedFileNames.length},
${sortedFileNames.map(s => `	&movie_test_${s.replace(/.png$/, '')}`).join(',\n')}
};

`);
