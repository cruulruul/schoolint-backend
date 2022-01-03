const fs = require('fs');
const {
  candidatesListsService,
  templatesService,
  candidatesService,
} = require('../services');
const { upload, excelParser } = require('../middlewares');
const config = require('../../config');

const candidatesListsController = {};

candidatesListsController.getAllCandidatesLists = (req, res) => {
  const candidatesLists = candidatesListsService.getAllCandidatesLists();
  res.status(200).json({ candidatesLists });
};

candidatesListsController.uploadList = async (req, res) => {
  try {
    // Uploads the file and adds form-data to req
    await upload(req, res);

    // Check for necessary form-data values and mimetype
    // File related
    if (req.file === undefined) {
      return res.status(400).send({ error: 'File missing' });
    }
    const fileName = req.file.originalname;
    if (!fileName) {
      return res.status(500).send({ error: 'File not found' });
    }
    // Check filetype (xls, xlsx)
    const fileTypes = ['xls', 'xlsx'];
    if (!fileTypes.includes(fileName.substring(fileName.indexOf('.') + 1))) {
      // delete the file
      fs.unlinkSync(`${config.baseDir}/uploads/${fileName}`);
      return res
        .status(406)
        .send({ error: `Wrong file type, allowed: ${fileTypes}` });
    }
    // Body related
    const templateId = parseInt(req.body.templateId, 10);
    const listYear = parseInt(req.body.year, 10);
    if (!listYear) {
      return res.status(400).send({ error: 'Year missing' });
    }
    if (!templateId) {
      return res.status(400).send({ error: 'TemplateId missing' });
    }
    // Check does the template exists
    const template = await templatesService.getTemplateById(templateId);
    if (!template) {
      return res
        .status(404)
        .send({ error: `Template with id, ${templateId}, not found!` });
    }

    // Converts the excel file to JSON and deletes the temporary file
    const jsonData = await excelParser(fileName);
    fs.unlinkSync(`${config.baseDir}/uploads/${fileName}`);
    if (!jsonData) {
      return res.status(500).send({
        error: 'Something went wrong while parsing the excel file',
      });
    }

    // Validates the data against the template
    const validation = await templatesService.validateJson(template, jsonData);
    if (validation.error) {
      return res.status(406).json({
        error: validation.error,
      });
    }

    // Passes the data to service for db insert
    const importDatabase = await candidatesService.createCandidates(jsonData);
    if (importDatabase.error) {
      return res.status(500).json({
        error: importDatabase.error,
      });
    }
  } catch (err) {
    return res.status(500).send({
      error: `Could not import the list: ${err}`,
    });
  }
  return res.status(201).send({
    message: 'Imported the list successfully',
  });
};

module.exports = candidatesListsController;
