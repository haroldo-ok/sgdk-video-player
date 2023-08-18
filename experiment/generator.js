const fs = require('fs');
//fs.readdirSync('tmpmv_test');
//parseInt(/^\w+_(\d+)\.png$/.exec('frame_142.png')[1])
const MOVIE_DIR = 'tmpmv_test/';
const GENSRC_DIR = 'src/generated/';
const RES_DIR = 'res/';

const removeExtension = s => s.replace(/.png$/, '');

const FILE_REGEX = /^frames_(\d+)_to_(\d+)\.png$/;
const fileNames = fs.readdirSync(MOVIE_DIR).filter(s => FILE_REGEX.test(s));
const sortedFileNames = fileNames
	.map(name => ({ idx: parseInt(FILE_REGEX.exec(name)[1]), name }))
	.sort((a, b) => a.idx - b.idx)
	.map(o => o.name);
	
if (!fs.existsSync(GENSRC_DIR)) {
	fs.mkdirSync(GENSRC_DIR, { recursive: true });
}

if (!fs.existsSync(RES_DIR)) {
	fs.mkdirSync(RES_DIR, { recursive: true });
}

const widthInChars = 40;
const heightInChars = 28;

const frameCount = sortedFileNames
	.map(name => {
		const parts = FILE_REGEX.exec(name);
		return parseInt(parts[2]) - parseInt(parts[1]) + 1;
	})
	.reduce((acc, n) => acc + n, 0);

fs.writeFileSync(`${GENSRC_DIR}/movie_res.h`, `
#ifndef _MOVIE_RES_H
#define _MOVIE_RES_H

#include <genesis.h>

typedef struct MovieData {
	u16 w, h;
	u16 frameCount;
	u16 imageCount;
	const Image *frames[];
} MovieData;

extern const MovieData movie_test;

#endif // _MOVIE_RES_H
`);

fs.writeFileSync(`${GENSRC_DIR}/movie_res.c`, `
#include "movie_res.h"
#include "movie_frames.h"

const MovieData movie_test = {
	${widthInChars}, ${heightInChars},
	${frameCount},
	${sortedFileNames.length},

	{
${sortedFileNames.map(s => `		&movie_test_${removeExtension(s)}`).join(',\n')}
	}

};

`);

fs.writeFileSync(`${RES_DIR}/movie_frames.res`, sortedFileNames
	.map(s => `IMAGE movie_test_${removeExtension(s)} "../${MOVIE_DIR}/${s}" FAST`).join('\n') + '\n');
