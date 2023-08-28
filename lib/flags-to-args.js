const glob = require('glob');

/**
 * Returns array of gcc flags
 *
 * @param {object} flags 
 * @returns {string[]}
 */
module.exports = function flagsToArgs(flags) {
  return Object.entries(flags).flatMap(([flag, values]) => {
    if (!Array.isArray(values)) {
      values = [values];
    }

    return values.flatMap((value) => {
      if (flag === 'externs') {
        return glob.sync(value).map((resolved) => buildFlag(flag, resolved));
      } else {
        return buildFlag(flag, value);
      }
    });
  });
}

/**
 * Build gcc flag
 *
 * @param {string} flag 
 * @param {string} value 
 * @returns {string} 
 */
function buildFlag(flag, value) {
  return '--' + flag + (value == null ? '' : '=' + value)
}