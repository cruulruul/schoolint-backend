/* eslint-disable operator-linebreak */
const db = require('../../db');

const templatesService = {};

/**
 * All templates query from the database
 * @returns {json}
 * If no records found returns false.
 * On success returns JSON.
 */
templatesService.getTemplates = async () => {
  const templates = await db.query(
    `SELECT 
    T.id, T.name
  FROM Template T;`,
  );
  if (!templates[0]) return false;
  return templates;
};

/**
 * Single template query from the database
 * @param {int} id
 * @returns {json}
 * If no records found returns false.
 * On success returns JSON.
 */
templatesService.getTemplateById = async (id) => {
  const template = await db.query(
    `SELECT 
      T.id, T.name , CONCAT('["', REPLACE(GROUP_CONCAT(TF.name), ',', '","'), '"]') as fields
    FROM Template T
    INNER JOIN TemplateFields TF
      ON T.id = TF.Template_id
    WHERE T.id = ?
    GROUP BY T.id;`,
    [id],
  );
  if (!template[0]) return false;
  return template[0];
};

/**
 * Sheet fields query from the database
 * @param {string} id
 * @returns {json}
 * If no records found returns false.
 * On success returns JSON.
 */
templatesService.getSheetsFieldsByTemplateId = async (id) => {
  const fields = await db.query(
    `SELECT 
      TS.name, CONCAT('["', REPLACE(GROUP_CONCAT(TF.name), ',', '","'), '"]') as fields
    FROM TemplateSheet TS
    LEFT JOIN TemplateFields TF
      ON TS.id = TF.TemplateSheet_id
    WHERE TS.Template_id = ?
    GROUP BY TS.id;`,
    [id],
  );
  if (!fields) return false;
  return fields;
};

/**
 * Inserts query, new template with fields into the database.
 * @param {json} newTemplate
 * @returns {json}
 * Returns JSON, new template Id
 */
templatesService.createTemplates = async (newTemplate) => {
  let result = await db.query('INSERT INTO Template (name) VALUES (?);', [
    newTemplate.name,
  ]);
  const newTemplateId = result.insertId;
  newTemplate.fields.forEach(async (element) => {
    result = await db.query(
      'INSERT INTO TemplateFields (Template_id, name) VALUES (?, ?);',
      [newTemplateId, element],
    );
  });
  return newTemplateId;
};

/**
 * Delete query, remove given template and it's fields
 * @param {int} id
 * @returns {boolean}
 * If rowcount is not 1, return false.
 * On success return true.
 */
templatesService.deleteTemplateById = async (id) => {
  await db.query('DELETE FROM TemplateFields WHERE Template_id = ?', [id]);
  const result = await db.query('DELETE FROM Template WHERE id = ?', [id]);
  if (result.affectedRows === 1) {
    return true;
  }
  return false;
};

templatesService.validateJson = async (templateId, data) => {
  const template = templatesService.getTemplateById(templateId).values;
  const templateSheets = Object.keys(template);
  const importSheets = Object.keys(data);
  let importSheetHeaders = '';

  if (templateSheets.toString() !== importSheets.toString()) {
    return {
      error: `Sheet names not matching template: ${templateSheets}  importSheets: ${importSheets}`,
    };
  }

  for (let i = 0; i < templateSheets.length; i += 1) {
    const templateSheetHeaders = template[Object.keys(template)[0]].fields;
    importSheetHeaders = Object.keys(data[Object.keys(data)[i]].shift());
    templateSheetHeaders.sort();
    importSheetHeaders.sort();
    if (templateSheetHeaders.toString() !== importSheetHeaders.toString()) {
      return {
        error: `Sheet headers not matching templateSheetHeaders: ${templateSheetHeaders}, : dataSheetsHeaders: ${importSheetHeaders}`,
      };
    }
  }

  for (let i = 0; i < importSheets.length; i += 1) {
    const sheetData = data[Object.keys(data)[i]];
    for (let row = 0; row < sheetData.length - 1; row += 1) {
      const rowData = sheetData[row + 1];
      const rowHeaders = Object.keys(rowData);
      if (
        templatesService.checkIsEmpty(rowData, importSheetHeaders) ||
        rowHeaders.sort().toString() !== importSheetHeaders.sort().toString()
      ) {
        return {
          error: `Import failed, error on row ${
            row + 1
          }, value is spaces or missing!`,
        };
      }
    }
  }

  return true;
};

templatesService.checkIsEmpty = (data, headers) => {
  for (let i = 0; i < headers.length; i += 1) {
    const value = data[headers[i]];
    if (
      value === null ||
      value === undefined ||
      value.toString().match(/^ *$/) !== null
    ) {
      return true;
    }
  }
  return false;
};

module.exports = templatesService;
