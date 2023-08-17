const fs = require('fs');
//fs.readdirSync('tmpmv_test');
//parseInt(/^\w+_(\d+)\.png$/.exec('frame_142.png')[1])
const MOVIE_DIR = 'tmpmv_test/';
const GENSRC_DIR = 'src/generated/';
const RES_DIR = 'res/';

const removeExtension = s => s.replace(/.jpg$/, '');

const FILE_REGEX = /^frame_(\d+)\.jpg$/;
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

console.log('sortedFileNames', sortedFileNames);

const partition = (arr, partitionSize) => arr.reduce((acc, o) => {
	const tail = acc[acc.length - 1];
	if (!tail || tail.length >= partitionSize) {
		acc.push([o]);
	} else {
		tail.push(o);
	}
	return acc;
}, []);

console.log('partitioned', partition(sortedFileNames, 2));