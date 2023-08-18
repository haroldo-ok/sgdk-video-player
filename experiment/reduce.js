const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

//fs.readdirSync('tmpmv_test');
//parseInt(/^\w+_(\d+)\.png$/.exec('frame_142.png')[1])
const MOVIE_DIR = 'tmpmv_test/';
const GENSRC_DIR = 'src/generated/';
const RES_DIR = 'res/';

const FILE_REGEX = /^rawframes_(\d+)_to_(\d+)\.png$/;
console.log('rx', FILE_REGEX.test('rawframes_27_to_28.png'));

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

const { convert } = require('rgbquant-sms');

(async () => {
	
	const executeConverter = src => new Promise((resolve, reject) => {
		const parts = FILE_REGEX.exec(src);
		const dest = `frames_${parts[1]}_to_${parts[2]}.png`;

		console.log(`Starting to reduce colors on ${src} to ${dest}...`);
				
		const process = spawn('npx', ['rgbquant-sms',
			'convert', 
			MOVIE_DIR + src, 
			MOVIE_DIR + dest,
			'--colors', '16',
			'--maxTiles', '512',
			'--dithKern', 'Ordered2x1'], { shell: true });
		process.stdout.on('data', (data) => {
			console.log(data.toString());
		});
		process.stderr.on('error', (data) => {
			console.error(data.toString());
		});
		process.on('exit', (code) => {
			if (code) {
				reject(new Error(`Child returned error code ${code}`));
			} else {
				console.log(`Finished generating ${dest}.`);
				resolve({ dest });
			}
		});
		process.on('error', (e) => {
			reject(e);
		});
	});
	
	let queuePosition = 0;
	const spawnWorker = async () => {
		while (queuePosition < sortedFileNames.length) {
			const src = sortedFileNames[queuePosition];
			queuePosition++;			
			await executeConverter(src);
		}
	}
	
	await Promise.all(Array(8).fill(0).map(() => spawnWorker()));
})();