const coursesService = require('./coursesService');
const db = require('../../db');
const database = require('../../database');

const candidatesService = {};

// Returns list of candidates
candidatesService.getCandidates = () => {
  const { candidates } = database;
  return candidates;
};

// Find candidate by id. Returns candidate if found or false.
candidatesService.getCandidateById = (id) => {
  const candidate = database.candidates.find((element) => element.id === id);
  if (candidate) {
    return candidate;
  }
  return false;
};

/**
 * Inserts candidates into database from the generated JSON data
 * @param {json} jsonData
 * @param {json} template
 * @param {int} courseId
 * @param {int} listYear
 * @returns {(boolean|json)} On success: returns true, On failure: returns JSON with an error msg
 */
candidatesService.createCandidates = async (jsonData, courseId, listYear) => {
  // Creates the course year record into database.
  const courseYearId = await coursesService.createCourseYear(
    courseId,
    listYear,
  );
  if (!courseYearId) {
    return {
      error: 'Unable to insert the course year record into the database',
    };
  }
  let affectedRows = 0;
  let loopCounter = 0;
  try {
    await db.query('START TRANSACTION');
    Object.keys(jsonData).forEach(async (element) => {
      const data = jsonData[element];
      Object.keys(data).forEach(async (row) => {
        data[row].CourseYear_id = courseYearId;
        const rowResul = await db.query('INSERT INTO Candidate SET ?', [
          data[row],
        ]);
        affectedRows += rowResul.affectedRows;
        loopCounter += 1;
      });
    });

    await db.query('COMMIT');
  } catch (err) {
    return {
      error: `Something went wrong while inserting the records into the database, ${err}`,
    };
  }
  if (affectedRows !== loopCounter) {
    return {
      error: `Inserted rows are not the same as rows from the excel file: inserted ${affectedRows}, rows in file (all sheets) ${loopCounter}`,
    };
  }
  return true;
};

// updates candidate
candidatesService.updateCandidate = async (candidate) => {
  const index = database.candidates.findIndex(
    (element) => element.id === candidate.id,
  );
  if (candidate.firstName) {
    database.candidates[index].firstName = candidate.firstName;
  }
  if (candidate.lastName) {
    database.candidates[index].lastName = candidate.lastName;
  }
  if (candidate.email) {
    database.candidates[index].email = candidate.email;
  }
  if (candidate.personalId) {
    database.candidates[index].personalId = candidate.personalId;
  }
  if (candidate.notes) {
    database.candidates[index].notes = candidate.notes;
  }
  if (candidate.present != null) {
    database.candidates[index].present = candidate.present;
  }
  if (candidate.comments) {
    database.candidates[index].comments = candidate.comments;
  }
  return true;
};

// Deletes candidate
candidatesService.deleteCandidateById = (id) => {
  const index = database.candidates.findIndex((element) => element.id === id);
  // Remove candidate from 'database'
  database.candidates.splice(index, 1);
  return true;
};

module.exports = candidatesService;
