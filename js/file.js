const fs = require('fs');
const path = require('path');

const checkFileExists = async fileName => fs.promises.access(fileName, fs.constants.F_OK)
   .then(() => true)
   .catch(() => false);
   
const changeFileExtension = (file, extension) => {
  const baseName = path.basename(file, path.extname(file))
  return path.join(path.dirname(file), baseName + extension);
};

const removeFileExtension = file => changeFileExtension(file, '');
   
const clearDir = async dir => {
	for (const fileName of await fs.promises.readdir(dir)) {
		await fs.promises.unlink(path.join(dir, fileName));
	}
};

const listFilesRegex = async (dir, fileRegex) => {
	const allFiles = await fs.promises.readdir(dir);
	const fileNames = allFiles.filter(s => fileRegex.test(s));
	const sortedFileNames = fileNames
		.map(name => ({ idx: parseInt(fileRegex.exec(name)[1]), name }))
		.sort((a, b) => a.idx - b.idx)
		.map(o => o.name);
		
	return sortedFileNames;
};

module.exports = { checkFileExists, changeFileExtension, removeFileExtension, clearDir, listFilesRegex };