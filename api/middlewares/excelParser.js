const excelToJson = require('convert-excel-to-json');
const config = require('../../config');

/**
 * Parses excel file and returns JSON Object.
 * @param {string} filename
 * @returns {json}
 */
const excelParser = async (filename) => {
  const result = await excelToJson({
    sourceFile: `${config.baseDir}/uploads/${filename}`,
    columnToKey: {
      '*': '{{columnHeader}}',
    },
  });

  return result;
};

module.exports = excelParser;
