const fs = require('fs');
//fs.readdirSync('tmpmv_test');
//parseInt(/^\w+_(\d+)\.png$/.exec('frame_142.png')[1])
const MOVIE_DIR = 'tmpmv_test/';
const GENSRC_DIR = 'src/generated/';
const RES_DIR = 'res/';

const removeExtension = s => s.replace(/.png$/, '');

const FILE_REGEX = /^\w+_(\d+)\.png$/;
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
