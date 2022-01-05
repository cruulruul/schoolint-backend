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
      id, name
    FROM Template;`,
  );
  if (!templates[0]) return false;

  const idArray = [];

  templates.forEach((element) => {
    const key = element;
    idArray.push(key.id);
  });

  const idFieldsArray = {};
  // eslint-disable-next-line no-restricted-syntax
  for (const id of idArray) {
    // eslint-disable-next-line no-await-in-loop
    const fields = await templatesService.getSheetsFieldsByTemplateId(id);
    fields.forEach((element) => {
      const key = element;
      const { name } = key;
      const fieldsData = key.fields;
      if (!idFieldsArray[id]) idFieldsArray[id] = {};
      idFieldsArray[id][name] = JSON.parse(fieldsData).sort();
    });
    const template = templates.find((element) => element.id === id);
    template.values = idFieldsArray[id];
  }
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
      id, name
    FROM Template
    WHERE id = ?;`,
    [id],
  );
  if (!template[0]) return false;
  const idFieldsArray = {};
  const fields = await templatesService.getSheetsFieldsByTemplateId(id);
  fields.forEach((element) => {
    const key = element;
    const { name } = key;
    const fieldsData = key.fields;
    if (!idFieldsArray[id]) idFieldsArray[id] = {};
    idFieldsArray[id][name] = JSON.parse(fieldsData).sort();
  });
  template[0].values = idFieldsArray[id];
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
  Object.keys(newTemplate.values).forEach(async (key) => {
    result = await db.query(
      'INSERT INTO TemplateSheet (Template_id, name) values (?,?)',
      [newTemplateId, key],
    );
    const sheetId = result.insertId;
    const fieldsArray = newTemplate.values[key];
    fieldsArray.forEach(async (name) => {
      result = await db.query(
        'INSERT INTO TemplateFields (TemplateSheet_id, name) VALUES (?, ?);',
        [sheetId, name],
      );
    });
  });
  return newTemplateId;
};

/**
 * Delete query, remove given template and it's fields
 * @param {int} id
 * @returns {boolean}
 * If rowcount is not greater than 1, return false.
 * On success return true.
 */
templatesService.deleteTemplateById = async (id) => {
  // Get the TemplateSheed_id's
  const sheetIdArray = await db.query(
    'SELECT id FROM TemplateSheet WHERE Template_id = ?',
    [id],
  );
  sheetIdArray.forEach(async (element) => {
    await db.query('DELETE FROM TemplateFields WHERE TemplateSheet_id = ?', [
      element.id,
    ]);
  });
  await db.query('DELETE FROM TemplateSheet WHERE Template_id = ?', [id]);
  const result = await db.query('DELETE FROM Template WHERE id = ?', [id]);
  if (result.affectedRows === 1) {
    return true;
  }
  return false;
};

/**
 * Validates the data, compares with the template (sheet names, collumn names).
 * Checks the cells values (not allowed empty or spaces)
 * @param {json} templateObject
 * @param {json} data
 * @returns {(boolean|Array)}
 * On success: returns true
 * On error: returns error message JSON
 */
templatesService.validateJson = async (templateObject, data) => {
  const template = templateObject.values;
  const templateSheets = Object.keys(template);
  const importSheets = Object.keys(data);
  let templateSheetHeaders = [];
  let importSheetHeaders = [];
  let skimmedTemplateHeaders = [];

  // Compare template and imported excel sheet names
  if (
    templateSheets.toString().toLowerCase() !==
    importSheets.toString().toLowerCase()
  ) {
    return {
      error: `Sheet names not matching! template: ${templateSheets} :: importSheets: ${importSheets}`,
    };
  }

  // Compare template and imported excel sheet headers
  for (let i = 0; i < templateSheets.length; i += 1) {
    templateSheetHeaders = template[Object.keys(template)[0]];
    skimmedTemplateHeaders = [...templateSheetHeaders];
    importSheetHeaders = Object.keys(data[Object.keys(data)[i]].shift());

    for (
      let counter = 0;
      counter < skimmedTemplateHeaders.length;
      counter += 1
    ) {
      if (skimmedTemplateHeaders[counter].includes(';')) {
        skimmedTemplateHeaders[counter] = skimmedTemplateHeaders[
          counter
        ].substring(skimmedTemplateHeaders[counter].indexOf(';') + 1);
      }
    }

    skimmedTemplateHeaders.sort();
    importSheetHeaders.sort();
    if (skimmedTemplateHeaders.toString() !== importSheetHeaders.toString()) {
      return {
        error: `Sheet headers not matching! templateSheetHeaders: ${skimmedTemplateHeaders} :: dataSheetsHeaders: ${importSheetHeaders}`,
      };
    }
  }

  // Check row data for empty values
  for (let i = 0; i < importSheets.length; i += 1) {
    const sheetData = data[Object.keys(data)[i]];
    for (let row = 0; row < sheetData.length; row += 1) {
      const rowData = sheetData[row];

      const emptyRows = templatesService.checkIsEmpty(
        rowData,
        importSheetHeaders,
        templateSheetHeaders,
      );

      if (emptyRows[0]) {
        return {
          error: `Import failed, error on row ${row + 2}, ${
            emptyRows[1]
          }, value is spaces or missing!`,
        };
      }
    }
  }

  return true;
};

/**
 * Helper function to detect row empty cells
 * @param {array} data
 * @param {array} headers
 * @returns {Array} On success (found not allowed empty cell): [true, header],
 * On failure [false, '']
 */
templatesService.checkIsEmpty = (data, headers, templateHeaders) => {
  for (let i = 0; i < headers.length; i += 1) {
    const header = headers[i];
    let allowedNull = false;
    templateHeaders.forEach((element) => {
      const splitTempHeader = element.split(';');
      if (header === splitTempHeader[1]) {
        const prefix = splitTempHeader[0].split('|');
        if (prefix[1] === 'null') {
          allowedNull = true;
        }
      }
    });
    if (!allowedNull) {
      const value = data[header];
      if (
        value === null ||
        value === undefined ||
        value.toString().match(/^ *$/) !== null
      ) {
        return [true, header];
      }
    }
  }
  return [false, ''];
};

module.exports = templatesService;
