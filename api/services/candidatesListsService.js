const db = require('../../db');

const candidatesListsService = {};

/**
 * All lists query from the database
 * @returns {json}
 * If no records found returns empty JSON.
 */
candidatesListsService.getAllCandidatesLists = async () => {
  const candidatesLists = await db.query(`
    SELECT
      CY.id, CY.year, C.name as listCode, CY.enabled, CY.created
    FROM CourseYear as CY
    INNER JOIN Course C on CY.Course_id=C.id;`);
  return candidatesLists;
};

/**
 * Single list query from the database
 * @param {int} id
 * @returns {(json|boolean)}
 * If no records found returns false
 * On success returns JSON.
 */
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

/**
 * Updates the list with given id,
 * @param {json} list
 * @returns {boolean}
 * If no rows were updated returns false, on success returns true
 */
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

/**
 * Helper, swaps the imported excel headers to template ones
 * (needed to map the db collumn names after while inserting to db)
 * @param {json} templateObject
 * @param {json} data
 * @returns {json}
 * Returns swapped JSON dataset.
 */
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
