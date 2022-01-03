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
    await upload(req, res);

    if (req.file === undefined) {
      return res.status(400).send({ error: 'Please upload a file!' });
    }

    const templateId = parseInt(req.body.templateId, 10);

    if (!templateId) {
      return res.status(400).send({ error: 'Please choose a template!' });
    }

    if (!templatesService.getTemplateById(templateId)) {
      return res
        .status(404)
        .send({ error: `Template with id, ${templateId}, not found!` });
    }

    const jsonData = await excelParser(req.file.originalname);

    fs.unlinkSync(`${config.baseDir}/uploads/${req.file.originalname}`);

    const validation = await templatesService.validateJson(
      templateId,
      jsonData,
    );
    if (validation.error) {
      return res.status(409).json({
        error: validation.error,
      });
    }

    const importDatabase = candidatesService.createCandidates(jsonData);
    if (importDatabase.error) {
      return res.status(409).json({
        error: importDatabase.error,
      });
    }
  } catch (err) {
    res.status(500).send({
      error: `Could not import the list: ${err}`,
    });
  }
  return res.status(201).send({
    message: 'Imported the list successfully',
  });
};

module.exports = candidatesListsController;
