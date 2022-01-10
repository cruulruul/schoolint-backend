const coursesService = require('./coursesService');
const candidatesResultsService = require('./candidatesResultsService');
const db = require('../../db');

const candidatesService = {};

/**
 * Corresponding candidates query from the database.
 * If admin, returns all active list candidates.
 * @param {id} userId
 * @param {string} userRole
 * @returns {object}
 * If no records found returns empty JSON.
 */
candidatesService.getCandidates = async (userId, userRole) => {
  let sqlString = `
    SELECT 
    c.id,
      (CONCAT(co.name, RIGHT(cy.year,char_length(cy.year)-2))) as specialityCode,
      co.name as courseName,
      cy.year,
      cy.id as courseYearId,
      c.first_name as firstName,
      c.last_name as lastName,
      c.email,
      c.personal_id as personalId,
      c.present,
      ir.room,
      ir.time
    FROM Candidate c
    INNER JOIN CourseYear cy on c.CourseYear_id=cy.id
    INNER JOIN Course co on cy.Course_id=co.id
    LEFT JOIN ImportResult ir on c.personal_id=ir.Candidate_personal_id
  `;
  if (userRole === 'Admin') {
    sqlString += 'WHERE cy.enabled = 1;';
  } else {
    sqlString += `INNER JOIN (SELECT id, Course_id FROM User) u on co.id=u.Course_id
    WHERE cy.enabled = 1
    and u.id=${userId};`;
  }
  const candidates = await db.query(sqlString);
  return candidates;
};

/**
 * Single candidate query from the database by id.
 * @param {int} id
 * @param {int} userId
 * @param {string} userRole
 * @returns {(object|boolean)}
 * If no record found returns false
 * On success returns an object.
 */
candidatesService.getCandidateById = async (id, userId, userRole) => {
  let sqlString = `
    SELECT 
    c.id,
      (CONCAT(co.name, RIGHT(cy.year,char_length(cy.year)-2))) as specialityCode,
      co.name as courseName,
      cy.year,
      cy.id as courseYearId,
      c.first_name as firstName,
      c.last_name as lastName,
      c.email,
      c.personal_id as personalId,
      c.address as residence,
      c.phone as phoneNumber,
      c.present,
      (CONCAT(IFNULL(c.notes,""), 
      IFNULL(CONCAT("\nexam1:", c.exam1),""), 
          IFNULL(CONCAT("\nexam2:", c.exam2),""), 
          IFNULL(CONCAT("\nexam3:", c.exam3),""), 
          IFNULL(CONCAT("\nexam4:", c.exam4),""))) as notes
    FROM Candidate c
    INNER JOIN CourseYear cy on c.CourseYear_id=cy.id
    INNER JOIN Course co on cy.Course_id=co.id
  `;
  if (userRole === 'Admin') {
    sqlString += `WHERE cy.enabled = 1 and c.id = ${id};`;
  } else {
    sqlString += `INNER JOIN (SELECT id, Course_id FROM User) u on co.id=u.Course_id
    WHERE cy.enabled = 1
    and u.id=${userId} and c.id=${id};`;
  }
  const candidate = await db.query(sqlString);

  // Get candidate test results
  if (candidate[0]) {
    const results = await candidatesResultsService.getResultsByPersonalIdid(
      candidate[0].personalId,
      candidate[0].courseYearId,
    );
    Object.assign(candidate[0], results);
    const attachments = await candidatesService.getCandidateAttachments(id);
    Object.assign(candidate[0], attachments);
  } else {
    return false;
  }
  return candidate[0];
};

/**
 * Query for candidate attachments
 * @param {id} id
 * @returns {object} Returns JSON.
 */
candidatesService.getCandidateAttachments = async (id) => {
  const attachments = await db.query(
    `
  SELECT
    id, filename as fileName, original_name as originalName
  FROM schoolint.CandidateAttachment
  WHERE Candidate_id = ?;`,
    [id],
  );
  return { attachments };
};

/**
 * Single candidate attachment query from the database by attachment id
 * @param {id} id
 * @returns {(boolena|object)}
 * If no records found returns false.
 * On success returns JSON.
 */
candidatesService.getCandidateAttachmentById = async (id) => {
  const attachment = await db.query(
    `
  SELECT
    id, filename as fileName, original_name as originalName, Candidate_id as candidateId
  FROM schoolint.CandidateAttachment
  WHERE id = ?;`,
    [id],
  );
  if (!attachment[0]) return false;
  return attachment[0];
};

/**
 * Inserts candidates into database from the generated JSON data
 * @param {object} jsonData
 * @param {object} template
 * @param {int} courseId
 * @param {int} listYear
 * @returns {(boolean|object)} On success: returns true, On failure: returns JSON with an error msg
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
        const rowResult = await db.query('INSERT INTO Candidate SET ?', [
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
      error: `Inserted rows are not the same as rows from the excel file: inserted ${affectedRows}, rows in file (all sheets) ${loopCounter}`,
    };
  }
  return true;
};

/**
 * Updates the candidate with given id,
 * @param {json}
 * @returns {boolean}
 * If no rows were updated returns false, on success returns true
 */
candidatesService.updateCandidate = async (candidate) => {
  const candidateToUpdate = {};
  if (candidate.present === undefined) {
    return false;
  }
  candidateToUpdate.present = candidate.present;
  const result = await db.query('UPDATE Candidate SET ? WHERE id = ?', [
    candidateToUpdate,
    candidate.id,
  ]);
  if (result.affectedRows === 1) {
    return true;
  }
  return false;
};

/**
 * Inserts the candidate attachment info into the database
 * @param {int} candidateId
 * @param {string} filename
 * @param {string} originalname
 * @returns {int}
 */
candidatesService.createAttachment = async (
  candidateId,
  filename,
  originalname,
) => {
  const file = {
    filename,
    candidate_id: candidateId,
    original_name: originalname,
  };
  const result = await db.query('INSERT INTO CandidateAttachment SET ?', [
    file,
  ]);
  if (!result.insertId) {
    return {
      error: 'An internal error occurred while trying to upload the file',
    };
  }
  return result.insertId;
};

/**
 * Delete query, remove candidate attachment by id and candidate id
 * @param {int} id
 * @param {int} candidateId
 * @returns {boolena}
 */
candidatesService.deleteAttachment = async (id, candidateId) => {
  const result = await db.query(
    'DELETE FROM CandidateAttachment WHERE id = ? and candidate_id = ?',
    [id, candidateId],
  );
  if (result.affectedRows === 1) {
    return true;
  }
  return false;
};

module.exports = candidatesService;
