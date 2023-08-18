const fs = require('fs');
const { spawn } = require('child_process');

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

const executeJoiner = async (srcFiles, destFile) => new Promise((resolve, reject) => {
	console.log(`Starting to generate ${destFile}...`);
	
	const fullSrcFiles = srcFiles.map(src => `${MOVIE_DIR}/${src}`);
	
	const process = spawn('magick', [
		...fullSrcFiles,
		'-append',
		`${MOVIE_DIR}/${destFile}`
	]);
	process.stdout.on('data', (data) => {
		console.log(data.toString());
	});
	process.stderr.on('data', (data) => {
		console.error(data.toString());
	});
	process.on('exit', (code) => {
		if (code) {
			reject(new Error(`Child returned error code ${code}`));
		} else {
			console.log(`Finished generating ${destFile}.`);
			resolve({ destFile });
		}
	});
});

(async () => {
	let frameNumber = 1;
	for (srcFiles of partition(sortedFileNames, 2)) {
		const finalFrame = frameNumber + srcFiles.length - 1;
		const destFile = `frames_raw_${frameNumber}_to_${finalFrame}.png`;
		await executeJoiner(srcFiles, destFile);
		frameNumber += srcFiles.length;
	}
})();