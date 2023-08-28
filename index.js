const path = require('path');
const { Transform } = require('stream');
const Vinyl = require('vinyl');
const PluginError = require('plugin-error');
const log = require('fancy-log');

const { flagsToArgs, compile } = require('./lib');

const PLUGIN_NAME = 'gulp-closure-compiler2';

/**
 * @typedef {Object<string, null | boolean | string | string[]>} CompilerFlags
 *
 * @typedef {object} GulpGCCOptions
 * @prop {string} fileName
 * @prop {CompilerFlags} compilerFlags
 * @prop {string[]} [javaFlags]
 * @prop {number} [maxBuffer]
 * @prop {boolean} [continueWithWarnings]
 */

/**
 * 
 * @param {GulpGCCOptions} options 
 * @returns 
 */
module.exports = function gulpClosureCompiler2(options = {}) {
  const { compilerFlags = {}, javaFlags = [], fileName } = options;

  if (!fileName) {
    throw new PluginError(PLUGIN_NAME, 'Missing fileName option.');
  }

  return new Transform({
    objectMode: true,

    /**
     * @param {import('vinyl')} file 
     * @param {any} enc 
     * @param {(err: Error, res: import('vinyl'))} callback 
     */
    transform(file, enc, callback) {
      if (file.isNull()) {
        return callback(null, file);
      }

      if (file.isStream()) {
        return callback(new PluginError(PLUGIN_NAME, 'Streaming not supported'))
      }

      let args = [`--js="${path.relative(file.cwd, file.path)}"`];
      args = javaFlags.concat(args);
      args = args.concat(flagsToArgs(compilerFlags));

      compile(args, {...options, log })

        .then((buffer) => {
          const result = new Vinyl({
            base: file.base,
            cwd: file.cwd,
            path: path.join(file.base, fileName),
            contents: buffer
          });

          callback(null, result);
        })

        .catch((error) => {
          const message = error instanceof Error ? error.message : error;

          callback(new PluginError(PLUGIN_NAME, message));
        });
    },
  });
};