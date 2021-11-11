/* eslint-disable consistent-return */
const excelToJson = require('convert-excel-to-json');
const fs = require('fs');
const uploadFile = require('../middlewares/upload');
const config = require('../../config');
const { templatesService, candidatesService } = require('../services');

const uploadController = {};

uploadController.upload = async (req, res) => {
  try {
    await uploadFile(req, res);

    if (req.file === undefined) {
      return res.status(400).send({ error: 'Please upload a file!' });
    }
    if (req.body.templateValue === undefined) {
      return res.status(400).send({ error: 'Please choose a template!' });
    }

    const jsonData = await uploadController.excelParser(req.file.originalname);
    const validation = await templatesService.validateJson(
      req.body.templateValue,
      jsonData,
    );

    if (validation.error) {
      return res.status(409).json({
        error: validation.error,
      });
    }
    fs.unlinkSync(`${config.baseDir}/uploads/${req.file.originalname}`);

    const importDatabase = candidatesService.createCandidates(jsonData);
    if (importDatabase.error) {
      return res.status(409).json({
        error: importDatabase.error,
      });
    }

    res.status(200).send({
      message: `Imported the file successfully: ${req.file.originalname}`,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      error: `Could not import the file: ${req.file.originalname}. ${err}`,
    });
  }
};

uploadController.excelParser = async (file) => {
  const result = excelToJson({
    sourceFile: `${config.baseDir}/uploads/${file}`,
    columnToKey: {
      '*': '{{columnHeader}}',
    },
  });

  return result;
};

module.exports = uploadController;
