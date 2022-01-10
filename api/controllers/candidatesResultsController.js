const fs = require('fs');
const {
  candidatesResultsService,
  coursesService,
  templatesService,
} = require('../services');
const { upload, excelParser } = require('../middlewares');
const config = require('../../config');

const candidatesResultsController = {};

/**
 * Uploads the file to {baseDir}/uploads/ (defined in config.js).
 * Checks the file extension (only xls or xlsx allowed).
 * Parses the excel file to json and compares the data with template
 * Passes the data to service for db insert.
 * @param {int} req.body.id
 * @param {file} req.file
 * @returns {any} On success returns JSON success and status 201.
 * On failure returns JSON with error message and status code 400, 404, 406 or 500.
 */
candidatesResultsController.uploadResults = async (req, res) => {
  try {
    // Uploads the file and adds form-data to req
    await upload(req, res);

    // Check for necessary form-data values and mimetype
    // File related
    if (req.file === undefined) {
      return res.status(400).send({ error: 'File missing' });
    }
    const fileName = req.file.filename;
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

    // Check req.body related
    const courseYearId = parseInt(req.body.id, 10);
    if (!courseYearId) {
      return res.status(400).send({ error: 'CourseYearId missing' });
    }

    // Check does the course year list record exists
    const courseList = await coursesService.getCourseListById(courseYearId);
    if (!courseList) {
      return res.status(404).send({
        error: `Course year list with id, ${courseYearId}, not found!`,
      });
    }

    // Get course template id by course id
    const courseYearTemplateId = await coursesService.getCourseTemplateId(
      courseList.courseId,
    );
    if (!courseYearTemplateId.templateId) {
      return res.status(404).send({
        error: `No template id found for course with id, ${courseList.courseId}`,
      });
    }

    // Check does the template exists
    const template = await templatesService.getTemplateById(
      courseYearTemplateId.templateId,
    );
    if (!template) {
      return res.status(404).send({
        error: `Template with id, ${courseYearTemplateId}, not found!`,
      });
    }

    // Converts the excel file to JSON and deletes the temporary file
    let jsonData = await excelParser(fileName);
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
    // Swap the JSON object key's to template ones
    jsonData = await templatesService.changeJsonKeys(template, jsonData);

    // Remove unnecessary data and concat text: cells
    jsonData = await templatesService.skimData(template, jsonData);

    // Passes the data to service for db insert
    const importDatabase = await candidatesResultsService.addResultsToCandidates(
      courseYearId,
      jsonData,
    );
    if (importDatabase.error) {
      return res.status(500).json({
        error: importDatabase.error,
      });
    }
  } catch (err) {
    return res.status(500).send({
      error: `An internal error occurred while trying to upload the course results: ${err}`,
    });
  }
  return res.status(201).send({
    success: 'Imported the result successfully',
  });
};

module.exports = candidatesResultsController;
