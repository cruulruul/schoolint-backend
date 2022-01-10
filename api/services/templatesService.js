/* eslint-disable operator-linebreak */
const db = require('../../db');

const templatesService = {};

/**
 * All templates query from the database
 * @returns {object}
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
 * @returns {object}
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
 * @returns {object}
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
 * @returns {object}
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
 * @param {object} templateObject
 * @param {object} data
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

  // Check does the headers from the template exitsts in imported data
  // for (let i = 0; i < templateSheets.length; i += 1) {

  // }

  const matchingSheets = importSheets.filter(
    (e) => templateSheets.indexOf(e) !== -1,
  );
  if (matchingSheets.length === 0) {
    return {
      error: `Üleslaetud exceli failis puuduvad vajalikud sheet'id. Nõutud: ${templateSheets}`,
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
        if (
          skimmedTemplateHeaders[counter].includes('text;') ||
          skimmedTemplateHeaders[counter].includes('text|null;')
        ) {
          skimmedTemplateHeaders.splice(counter, 1);
          counter -= 1;
        } else {
          skimmedTemplateHeaders[counter] = skimmedTemplateHeaders[
            counter
          ].substring(skimmedTemplateHeaders[counter].indexOf(';') + 1);
        }
      }
    }

    skimmedTemplateHeaders.sort();
    importSheetHeaders.sort();
    const matchingHeaders = importSheetHeaders.filter(
      // eslint-disable-next-line no-loop-func
      (e) => skimmedTemplateHeaders.indexOf(e) !== -1,
    );
    if (
      matchingHeaders.length === 0 ||
      matchingHeaders.length !== skimmedTemplateHeaders.length
    ) {
      return {
        error: `Üleslaetud exceli failis puuduvad vajalikul sheet'il nõutud päised. Nõutud: ${skimmedTemplateHeaders.sort()}`,
      };
    }
  }

  // Check row data for empty values
  for (let i = 0; i < matchingSheets.length; i += 1) {
    // const sheetData = data[Object.keys(data)[i]];
    const sheetData = data[matchingSheets[i]];
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
    let allowedNull = true;
    templateHeaders.forEach((element) => {
      const splitTempHeader = element.split(';');
      if (header === splitTempHeader[1]) {
        const prefix = splitTempHeader[0].split('|');
        if (prefix[1] === 'null') {
          allowedNull = true;
        } else {
          allowedNull = false;
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

/**
 * Helper, swaps the imported excel headers to template ones
 * (needed to map the db collumn names after while inserting to db)
 * @param {object} templateObject
 * @param {object} data
 * @returns {object}
 * Returns swapped JSON dataset.
 */
templatesService.changeJsonKeys = async (templateObject, data) => {
  const template = templateObject.values;
  const newData = {};

  for (let i = 0; i < Object.keys(template).length; i += 1) {
    const templateSheetHeaders = template[Object.keys(template)[i]];
    const sheetData = data[Object.keys(template)[i]];
    newData[Object.keys(template)[i]] = {};
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

/**
 * Helper, removes unnessecary data and concatenates "text:" header cells values
 * @param {object} templateObject
 * @param {object} data
 * @returns {object}
 * Returns skimmed JSON object.
 */
templatesService.skimData = async (templateObject, data) => {
  const template = templateObject.values;
  const newData = {};

  for (let i = 0; i < Object.keys(template).length; i += 1) {
    const templateSheetHeaders = template[Object.keys(template)[i]];
    const sheetData = data[Object.keys(template)[i]];
    newData[Object.keys(template)[i]] = {};
    for (let row = 0; row < Object.keys(sheetData).length; row += 1) {
      const rowData = sheetData[row];
      let rowText = '';
      const newRowData = {};
      Object.keys(rowData).forEach((key) => {
        const value = rowData[key];
        const newKey = key;
        templateSheetHeaders.forEach((templateKey) => {
          const splitted = templateKey.split(';');
          const dbKey = splitted[0].split('|')[0];
          if (key === dbKey) {
            newRowData[newKey] = value;
          }
        });
        if (key.substring(0, 5) === 'text:') {
          rowText = rowText.concat(`${key.substring(5)}: ${value}`, '\n');
          newRowData.text = rowText;
        }
      });
      newData[Object.keys(data)[i]][row] = newRowData;
    }
  }
  return newData;
};

module.exports = templatesService;
