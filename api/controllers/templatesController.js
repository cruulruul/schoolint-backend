const { templatesService } = require('../services');

const templatesController = {};

/**
 * Get all templates
 * GET - /templates
 * Required values: none
 * Optional values: none
 * Success: status 200 - OK and list of results
 */
templatesController.getTemplates = (req, res) => {
  const templates = templatesService.getTemplates();
  res.status(200).json({
    templates,
  });
};

/**
 * Get template by template id
 * GET - /templates/:id
 * Required values: id
 * Optional values: none
 * Success: status 200 - OK and result with specified id
 * Error: status 400 - Bad Request and error message
 */
templatesController.getTemplateById = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const template = templatesService.getTemplateById(id);
  if (!template) {
    return res.status(400).json({
      error: `No result found with id: ${id}`,
    });
  }
  return res.status(200).json({
    template,
  });
};

/**
 * mock/test
 */
templatesController.createTemplates = (req, res) => {
  const data = templatesService.createTemplates();
  if (!data) {
    return res.status(409).json({
      error: 'error',
    });
  }
  return res.status(200).json({
    message: 'success',
  });
};

/**
 * Update template
 * PATCH - /template/:id
 * Required values: id, name, fields []
 * Optional values: firstName, lastName, personalId
 * Success: status 200 - OK and success message
 * Error: status 400 - Bad Request and error message
 * Error: status 500 - Server error and error message
 */
templatesController.updateTemplate = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { name, fields } = req.body;

  if (!id && !(name || fields)) {
    res.status(400).json({
      error: 'Required data is missing',
    });
  }
  const template = templatesService.getTemplateById(id);
  if (!template) {
    res.status(400).json({
      error: `No template found with id: ${id}`,
    });
  }
  const templateToUpdate = {
    id,
    name,
    fields,
  };
  const success = await templatesService.updateTemplate(templateToUpdate);
  if (!success) {
    return res.status(500).json({
      error: 'Something went wrong while updating the template',
    });
  }
  return res.status(200).json({
    success: true,
  });
};

/**
 * Delete template
 * DELETE - /templates/:id
 * Required values: id
 * Optional values: none
 * Success: status 204 - No Content
 * Error: status 400 - Bad Request and error message
 * Error: status 500 - Server error and error message
 */
templatesController.deleteTemplateById = (req, res) => {
  const id = parseInt(req.params.id, 10);
  // Check if template exists
  const template = templatesService.getTemplateById(id);
  if (!template) {
    return res.status(400).json({
      error: `No template found with id: ${id}`,
    });
  }
  const success = templatesService.deleteTemplateById(id);
  if (!success) {
    return res.status(500).json({
      error: 'Something went wrong while deleting template',
    });
  }
  return res.status(204).end();
};

module.exports = templatesController;
