/* eslint-disable operator-linebreak */
const database = require('../../database');

const templatesService = {};

// Returns list of templates
templatesService.getTemplates = () => {
  const { templates } = database;
  return templates;
};

// Find template by id. Returns template if found or false.
templatesService.getTemplateById = (id) => {
  const template = database.templates.find(
    (element) => element.id === parseInt(id, 10),
  );
  if (template) {
    return template;
  }
  return false;
};

// Creates new template
templatesService.createTemplates = () => {
  const result = true;
  return result;
};

// Updates template
templatesService.updateTemplate = async (template) => {
  const index = database.templates.findIndex(
    (element) => element.id === template.id,
  );
  if (template.name) {
    database.templates[index].name = template.name;
  }
  if (template.fields) {
    database.templates[index].fields = template.fields;
  }
  return true;
};

// Deletes template
templatesService.deleteTemplateById = (id) => {
  const index = database.templates.findIndex((element) => element.id === id);
  // Remove template from 'database'
  database.templates.splice(index, 1);
  return true;
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
