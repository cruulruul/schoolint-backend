const database = require('../../database');

const templatesService = {};

// Returns list of templates
templatesService.getTemplates = () => {
  const { templates } = database;
  return templates;
};

// Find template by id. Returns template if found or false.
templatesService.getTemplateById = (id) => {
  const template = database.templates.find((element) => element.id === id);
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

// updates template
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

module.exports = templatesService;
