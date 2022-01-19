const xl = require('excel4node');
const util = require('util');
const config = require('../../config');

/**
 * Parses excel file and returns JSON Object.
 * @param {string} filename
 * @returns {json}
 */
const jsonToExcel = async (courseName, fieldNames, data) => {
  const wb = new xl.Workbook();
  const ws = wb.addWorksheet('Tulemused');
  const headingColumnNames = fieldNames;
  // Write Column Title in Excel file
  let headingColumnIndex = 0;
  headingColumnNames.forEach((heading) => {
    const header = heading.split('|');
    ws.cell(1, (headingColumnIndex += 1)).string(header[1]);
  });
  // Write Data in Excel file
  let rowIndex = 2;
  data.forEach((record) => {
    let columnIndex = 0;
    headingColumnNames.forEach((heading) => {
      const header = heading.split('|');
      let cellData = record[header[0]];
      if (!cellData) {
        cellData = '';
      } else {
        cellData = cellData.toString();
      }
      ws.cell(rowIndex, (columnIndex += 1)).string(cellData);
    });
    rowIndex += 1;
  });

  const fileName = `${courseName}_export-${Date.now()}.xlsx`;

  wb.write = util.promisify(wb.write);

  await wb.write(`${config.baseDir}/uploads/${fileName}`);
  return fileName;
};

module.exports = jsonToExcel;
