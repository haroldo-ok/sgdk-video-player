const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

//fs.readdirSync('tmpmv_test');
//parseInt(/^\w+_(\d+)\.png$/.exec('frame_142.png')[1])
const MOVIE_DIR = 'tmpmv_test/';
const GENSRC_DIR = 'src/generated/';
const RES_DIR = 'res/';

const removeExtension = s => s.replace(/.\w+$/, '');

const FILE_REGEX = /^\w+_(\d+)\.jpg$/;
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


const { convert } = require('rgbquant-sms');

const convertFn = async src => {
	const dest = removeExtension(src) + '.png';
	console.log(`Starting to reduce colors on ${src} to ${dest}...`);
	await convert(MOVIE_DIR + src, MOVIE_DIR + dest, {
		colors: 16,
		maxTiles: 512,
		dithKern: 'Ordered2x1',
		weighPopularity: true,
		weighEntropy: false
	});
	console.log(`Finished generating ${dest}.`);
};

(async () => {
	const rgbQuantSmsPath = path.dirname(require.resolve('rgbquant-sms/package.json'));
	console.log('rgbQuantSmsPath', rgbQuantSmsPath);
	
	const src = sortedFileNames[25];
	const dest = removeExtension(src) + '.png';

	console.log(`Starting to reduce colors on ${src} to ${dest}...`);
	
	const process = spawn('node', ['--max-old-space-size=4096', rgbQuantSmsPath,
		'convert', 
		MOVIE_DIR + src, 
		MOVIE_DIR + dest,
		'--colors', '16',
		'--maxTiles', '512',
		'--dithKern', 'Ordered2x1']);
	process.stdout.on('data', (data) => {
		console.log(data.toString());
	});
	process.stderr.on('data', (data) => {
		console.error(data.toString());
	});
	process.on('exit', (code) => {
		console.log(`Child exited with code ${code}`);
	});
})();