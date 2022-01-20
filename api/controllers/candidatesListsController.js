const fs = require('fs');
const path = require('path');
const {
  candidatesListsService,
  templatesService,
  candidatesService,
  coursesService,
} = require('../services');
const { upload, excelParser, jsonToExcel } = require('../middlewares');
const config = require('../../config');

const candidatesListsController = {};

/**
 * Returns all the imported list from the database.
 * @returns {object} On success, returns JSON with data and status code 200.
 * On failure returns JSON with error message and status code 500.
 */
candidatesListsController.getAllCandidatesLists = async (req, res) => {
  try {
    const candidatesLists = await candidatesListsService.getAllCandidatesLists();
    return res.status(200).json({ candidatesLists });
  } catch (err) {
    return res.status(500).send({
      error: `Could not get candidates list: ${err}`,
    });
  }
};

/**
 * Enables/Disables the list
 * @param {int} req.params.id (.../lists/:id)
 * @param {object} req.body { enabled: 0/1 }
 * @returns {object} On success returns JSON (success=true).
 * On failure returns JSON with error msg and status code 400, 404 or 500.
 */
candidatesListsController.updateCandidateListById = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { enabled } = req.body;
  if (!id) {
    return res.status(400).json({
      error: `Not valid id: ${id}`,
    });
  }
  if (enabled === undefined && enabled > 1) {
    return res.status(400).json({
      error: 'Required data (enabled) is missing or bit (0/1)',
    });
  }
  try {
    const list = await candidatesListsService.getListById(id);
    if (!list) {
      return res.status(404).json({
        error: `No list found with id: ${id}`,
      });
    }
    const listToUpdate = {
      id,
      enabled,
    };
    const success = await candidatesListsService.updateCandidateListById(
      listToUpdate,
    );
    if (!success) {
      return res.status(500).json({
        error: 'Something went wrong while updating the list status',
      });
    }
    return res.status(200).json({
      success: true,
    });
  } catch (err) {
    return res.status(500).send({
      error: `Could not update candidates list: ${err}`,
    });
  }
};

/**
 * Uploads the file to {baseDir}/uploads/ (defined in config.js).
 * Checks the file extension (only xls or xlsx allowed).
 * Parses the excel file to json and compares the data with template
 * Passes the data to service for db insert.
 * @param {file} req.file
 * @param {int} req.body.courseId
 * @param {int} req.body.templateId
 * @param {int} req.body.year
 * @returns {object} On success returns JSON success and status 201.
 * On failure returns JSON with error message and status code 400, 404, 406 or 500.
 */
candidatesListsController.uploadList = async (req, res) => {
  try {
    // Uploads the file and adds form-data to req
    await upload(req, res);

    // Check for necessary form-data values and mimetype
    // File related
    if (req.file === undefined) {
      return res.status(400).send({ error: 'Fail on puudu!' });
    }
    const fileName = req.file.filename;
    if (!fileName) {
      return res.status(500).send({ error: 'Fail on puudu!' });
    }
    // Check filetype (xls, xlsx)
    const fileTypes = ['xls', 'xlsx'];
    if (!fileTypes.includes(fileName.substring(fileName.indexOf('.') + 1))) {
      // delete the file
      fs.unlinkSync(`${config.baseDir}/uploads/${fileName}`);
      return res
        .status(406)
        .send({ error: `Vale failitüüp, lubatud: ${fileTypes}` });
    }
    // Check req.body related
    const courseId = parseInt(req.body.courseId, 10);
    const listYear = parseInt(req.body.year, 10);
    if (!courseId) {
      return res.status(400).send({ error: '"courseId" puudulik!' });
    }

    if (!listYear) {
      return res.status(400).send({ error: '"listYear" puudulik!' });
    }

    // Check does the course exists
    const course = await coursesService.getCourseById(courseId);
    if (!course) {
      return res
        .status(404)
        .send({ error: `Kursust id-ga, ${courseId}, ei leitud!` });
    }

    // Check does the template exists
    const template = await templatesService.getTemplateById(1);
    if (!template) {
      return res
        .status(404)
        .send({ error: 'SAIS-i malli id-ga, 1, ei leitud!' });
    }

    // Converts the excel file to JSON and deletes the temporary file
    let jsonData = await excelParser(fileName);
    fs.unlinkSync(`${config.baseDir}/uploads/${fileName}`);
    if (!jsonData) {
      return res.status(500).send({
        error: 'Exceli faili parsimisel esines viga!',
      });
    }

    // Validates the data against the template
    const validation = await templatesService.validateJson(template, jsonData);
    if (validation.error) {
      return res.status(406).json({
        error: validation.error,
      });
    }

    // Swap the JSON object key's to template ones
    jsonData = await templatesService.changeJsonKeys(template, jsonData);

    // Remove unnecessary data and concat text: cells
    jsonData = await templatesService.skimData(template, jsonData);

    // Passes the data to service for db insert
    const importDatabase = await candidatesService.createCandidates(
      jsonData,
      courseId,
      listYear,
    );
    if (importDatabase.error) {
      return res.status(500).json({
        error: importDatabase.error,
      });
    }
  } catch (err) {
    return res.status(500).send({
      error: `Sisemine viga: ${err}`,
    });
  }
  return res.status(201).send({
    success: 'Imported the list successfully',
  });
};

candidatesListsController.deleteList = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (!id) {
    return res.status(400).json({
      error: `Not valid id: ${id}`,
    });
  }
  try {
    // Check if list exists
    const list = await candidatesListsService.getListById(id);
    if (!list) {
      return res.status(404).json({
        error: `No list found with id: ${id}`,
      });
    }
    const success = await candidatesListsService.deleteListById(id);
    if (success.error) {
      return res.status(500).json({
        error: `An internal error occurred while trying to delete the list: ${success.error}`,
      });
    }
    return res.status(204).end();
  } catch (err) {
    return res.status(500).send({
      error: `An internal error occurred while trying to delete the list: ${err}`,
    });
  }
};

candidatesListsController.exportList = async (req, res) => {
  const id = parseInt(req.params.id, 10);

  if (!id) {
    return res.status(400).json({
      error: `Not valid id: ${id}`,
    });
  }

  try {
    const list = await candidatesListsService.getListById(id);
    if (!list) {
      return res.status(404).json({
        error: `No list found with: ${id}`,
      });
    }

    const courseName = `${list.listCode}${list.year}`;

    const candidates = await candidatesService.getCandidates(
      null,
      null,
      true,
      id,
    );

    const fieldNames = [
      'personalId|Isikukood',
      'firstName|Eesnimi',
      'lastName|Perekonnanimi',
      'testScore|Testitulemus',
      'interviewScore|Intervjuu tulemus',
      'finalScore|Lõpptulemus',
    ];

    const file = await jsonToExcel(courseName, fieldNames, candidates);
    const fileLocation = path.join(config.baseDir, '/uploads/', file);
    return res.download(fileLocation, file);
  } catch (err) {
    return res.status(500).send({
      error: `An internal error occurred while trying to export the list: ${err}`,
    });
  }
};

module.exports = candidatesListsController;
