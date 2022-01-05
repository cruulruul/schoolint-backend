const db = require('../../db');

const candidatesListsService = {};

// Returns list of candidates lists
candidatesListsService.getAllCandidatesLists = async () => {
  const candidatesLists = await db.query(`
    SELECT
      CY.id, CY.year, C.name as listCode, CY.enabled, CY.created
    FROM CourseYear as CY
    INNER JOIN Course C on CY.Course_id=C.id;`);
  return candidatesLists;
};

candidatesListsService.getListById = async (id) => {
  const candidatesList = await db.query(
    `
  SELECT
    CY.id, CY.year, C.name as listCode, CY.enabled, CY.created
  FROM CourseYear as CY
  INNER JOIN Course C on CY.Course_id=C.id
  WHERE CY.id = ?;`,
    [id],
  );
  if (!candidatesList[0]) return false;
  return candidatesList[0];
};

candidatesListsService.updateCandidateListById = async (list) => {
  const listToUpdate = {
    enabled: list.enabled,
  };
  const result = await db.query('UPDATE CourseYear SET ? WHERE id = ?', [
    listToUpdate,
    list.id,
  ]);
  if (result.affectedRows === 1) {
    return true;
  }
  return false;
};

candidatesListsService.changeJsonKeys = async (templateObject, data) => {
  const template = templateObject.values;
  const importSheets = Object.keys(data);
  const newData = {};

  for (let i = 0; i < importSheets.length; i += 1) {
    const templateSheetHeaders = template[Object.keys(template)[i]];
    const sheetData = data[Object.keys(data)[i]];
    newData[Object.keys(data)[i]] = {};
    for (let row = 0; row < sheetData.length; row += 1) {
      const rowData = sheetData[row];
      const newRowData = {};
      Object.keys(rowData).forEach((key) => {
        const value = rowData[key];
        let newKey = key;
        templateSheetHeaders.forEach((templateKey) => {
          const splitted = templateKey.split(';');
          const dbKey = splitted[0].split('|')[0];
          if (key === templateKey.substring(templateKey.indexOf(';') + 1)) {
            newKey = dbKey;
          }
        });
        newRowData[newKey] = value;
      });
      newData[Object.keys(data)[i]][row] = newRowData;
    }
  }
  return newData;
};

module.exports = candidatesListsService;
