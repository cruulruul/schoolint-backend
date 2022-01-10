const db = require('../../db');

const candidatesResultsService = {};

/**
 * Query for single candidate test results.
 * @param {int} personalId
 * @param {int} courseYearId
 * @returns {object}
 * If no record found, returns empty
 * On success object
 */
candidatesResultsService.getResultsByPersonalIdid = async (
  personalId,
  courseYearId,
) => {
  const result = await db.query(
    `
    SELECT
      room,
      time,
      created,
      final_score as finalScore,
      text
    FROM ImportResult
    WHERE Candidate_personal_id = ? and CourseYear_id = ?`,
    [personalId, courseYearId],
  );

  const catScores = await db.query(
    `
    SELECT
      cat1,
      cat2,
      cat3,
      cat4
    FROM ImportResult
    WHERE Candidate_personal_id = ? and CourseYear_id =?
  `,
    [personalId, courseYearId],
  );
  if (catScores.length > 0) {
    Object.assign(result[0], { scores: catScores[0] });
  }
  return result[0];
};

/**
 * Inserts candidates test results into database
 * @param {int} courseYearId
 * @param {object} jsonData
 * @returns {(boolean|object)} On success: returns true, On failure: returns JSON with an error msg
 */
candidatesResultsService.addResultsToCandidates = async (
  courseYearId,
  jsonData,
) => {
  let affectedRows = 0;
  let loopCounter = 0;
  try {
    await db.query('START TRANSACTION');
    Object.keys(jsonData).forEach(async (element) => {
      const data = jsonData[element];
      Object.keys(data).forEach(async (row) => {
        data[row].CourseYear_id = courseYearId;
        const rowResult = await db.query('INSERT INTO ImportResult SET ?', [
          data[row],
        ]);
        affectedRows += rowResult.affectedRows;
        loopCounter += 1;
      });
    });
    await db.query('COMMIT');
    if (affectedRows !== loopCounter) await db.query('ROLLBACK');
  } catch (err) {
    return {
      error: `Something went wrong while inserting the records into the database, ${err}`,
    };
  }
  if (affectedRows !== loopCounter) {
    return {
      error: `Inserted rows amount is not the same as rows from the excel file: inserted ${affectedRows}, rows in file (all sheets) ${loopCounter}`,
    };
  }
  return true;
};

module.exports = candidatesResultsService;
