const fs = require('fs');
const path = require('path');
const pa11y = require('pa11y');

const htmlFiles = [];
const getFilesRecursively = (directory) => {
  fs.readdirSync(directory).forEach((file) => {
    const absolute = path.join(directory, file);
    if (fs.statSync(absolute).isDirectory()) {
      return getFilesRecursively(absolute);
    }

    if (absolute.endsWith('.html')) {
      return htmlFiles.push(absolute.replace(path.join(__dirname, '../'), './'));
    }

    return null;
  });
};

getFilesRecursively(path.join(__dirname, '../dist'));
const chunk = (array, size) => (
  Array.from(
    { length: Math.ceil(array.length / size) },
    (item, index) => array.slice(index * size, index * size + size),
  ));

const htmlFileChunks = chunk(htmlFiles, 5);

const runLinter = async (fileChunks) => {
  try {
    const options = {
      runners: [
        'axe',
        'htmlcs',
      ],
    };

    for (let i = 0; i < fileChunks.length; i += 1) {
      // await is usually a bad idea in for loops, but we want to run pa11y in
      // batches to avoid memory leaks with large numbers of pages
      // eslint-disable-next-line no-await-in-loop
      const results = await Promise.all(fileChunks[i].map((file) => pa11y(file, options)));
      results.forEach((result) => {
        console.log(result);
        if (result.issues.length) {
          process.exit(1);
        }
      });
    }
  } catch (error) {
    console.error(error);
  }
};

runLinter(htmlFileChunks);
