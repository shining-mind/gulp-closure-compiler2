const path = require('path');
const fs = require('fs');
const { compile } = require('../lib');

describe('compile', () => {
  const missingDir = path.resolve(__dirname, 'tmp', 'missing');
  const args = ['--js="./test/data/compile/index.js"'];

  beforeAll(async () => {
    if (fs.existsSync(missingDir)) {
      await fs.promises.rmdir(missingDir);
    }
  });

  it('should compile simple file', async () => {
    const fileName = './test/tmp/index.js';

    const buffer = await compile(args, {fileName});

    expect(buffer.toString('utf-8')).toEqual('var x=42;\n');
  });

  it('should create missing directories for the file', async () => {
    const fileName = './test/tmp/missing/index.js';

    await compile(args, {fileName});

    expect(fs.existsSync(missingDir)).toBeTruthy();
  });
});
