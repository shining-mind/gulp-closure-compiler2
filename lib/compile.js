const path = require('path');
const fs = require('fs');
const { execFile } = require('child_process');

/**
 * 
 * @param {string[]} args 
 * @param {import('./index').GulpGCCOptions}
 */
module.exports = async function compile(args, ctx) {
  const executable = path.resolve(process.cwd(), 'node_modules', '.bin', 'google-closure-compiler');

  if (!fs.existsSync(executable)) {
    throw new Error('Google Closure Compiler executable not found, check that you have installed `google-closure-compiler`');
  }

  const {
    fileName,
    log = console.warn,
    maxBuffer = 1000,
    continueWithWarnings = false,
  } = ctx;

  if (!fileName) {
    throw new Error('Filename is not specified');
  }

  const cleanup = async () => {
    if (fs.existsSync(fileName)) {
      await fs.promises.unlink(fileName);
    }
  };

  // Create directory for output file if it doesn't exist.
  if (!fs.existsSync(path.dirname(fileName))) {
    await fs.promises.mkdir(path.dirname(fileName));
  }
  
  const execArgs = [executable].concat(args);
  // Force --js_output_file to prevent [Error: stdout maxBuffer exceeded.]
  execArgs.push('--js_output_file="' + fileName + '"');

  try {
    // Run gcc
    await new Promise((resolve, reject) => {
      execFile('node', execArgs, { maxBuffer: maxBuffer * 1024 }, (error, stdout, stderr) => {
        if (stderr) {
          log(stderr);
        }

        if (error ?? (stderr && !continueWithWarnings)) {
          reject(error ?? new Error('Can\'t continue due to compilation warnings'));

        } else {
          resolve();
        } 
      });
    });

    return fs.promises.readFile(fileName);

  } finally {
    await cleanup();
  }
}