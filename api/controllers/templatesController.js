const { templatesService } = require('../services');

const templatesController = {};

/**
 * Returns all templates from database in JSON.
 * Example: "templates": [{ "id", "name", "fields" : Array}]
 * @param {any} req
 * @param {any} res
 * @returns {json}
 * If no result returns status code 404 with
 * error message "No templates found".
 * On success, returns JSON and status code 200.
 */
templatesController.getTemplates = async (req, res) => {
  const templates = await templatesService.getTemplates();
  if (!templates) {
    return res.status(404).json({
      error: 'No templates found',
    });
  }

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
      idFieldsArray[id][name] = JSON.parse(fieldsData);
    });
    const template = templates.find((element) => element.id === id);
    template.values = idFieldsArray[id];
  }
  return res.status(200).json({
    templates,
  });
};

/**
 * Returns single template record by id in JSON.
 * Example: "templates": [{ "id", "name", "fields" : Array}]
 * @param {int} req.params.id
 * @param {any} res
 * @returns {json}
 * If no template found returns status code 404 with
 * error message "No template found with id: {id}".
 * On success, returns JSON and status code 200.
 */
templatesController.getTemplateById = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const template = await templatesService.getTemplateById(id);
  if (!template) {
    return res.status(404).json({
      error: `No template found with id: ${id}`,
    });
  }
  const idFieldsArray = {};
  const fields = await templatesService.getSheetsFieldsByTemplateId(id);
  fields.forEach((element) => {
    const key = element;
    const { name } = key;
    const fieldsData = key.fields;
    if (!idFieldsArray[id]) idFieldsArray[id] = {};
    idFieldsArray[id][name] = JSON.parse(fieldsData);
  });
  template.values = idFieldsArray[id];
  return res.status(200).json({
    template,
  });
};

/**
 * Creates new template into database
 * @param {string} req.body.name
 * @param {array} req.body.fields
 * @param {any} res
 * @returns {json}
 * If the required data is missing returns status code 400
 * and error message: "Required data is missing".
 * If the id is not returned from the servive returns status 500.
 * On success, returns JSON with new Id.
 */
templatesController.createTemplates = async (req, res) => {
  const { name, values } = req.body;
  if (!name || !values) {
    return res.status(400).json({
      error: 'Required data is missing',
    });
  }
  const template = {
    name,
    values,
  };
  const id = await templatesService.createTemplates(template);
  if (!id) {
    return res.status(500).json({
      error: 'Unable to insert the template into the database',
    });
  }
  return res.status(201).json({
    id,
  });
};

/**
 * Deletes single template record by Id
 * @param {int} req.params.id
 * @param {any} res
 * If no template found with the given id, returns status code 404 and error message.
 * If deleting fails, returns status code 500 and error message.
 * On success, returns 204.
 */
templatesController.deleteTemplateById = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const template = await templatesService.getTemplateById(id);
  if (!template) {
    return res.status(404).json({
      error: `No template found with id: ${id}`,
    });
  }
  const success = await templatesService.deleteTemplateById(id);
  if (!success) {
    return res.status(500).json({
      error: 'Something went wrong while deleting the template',
    });
  }
  return res.status(204).end();
};

module.exports = templatesController;
