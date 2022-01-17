const candidatesService = require('./candidatesService');
const db = require('../../db');

const candidatesListsService = {};

/**
 * All lists query from the database
 * @returns {object}
 * If no records found returns empty JSON.
 */
candidatesListsService.getAllCandidatesLists = async () => {
  const candidatesLists = await db.query(`
    SELECT
      CY.id, CY.year, C.name as listCode, C.id as courseId, CY.enabled, CY.created
    FROM CourseYear as CY
    INNER JOIN Course C on CY.Course_id=C.id;`);
  return candidatesLists;
};

/**
 * Single list query from the database
 * @param {int} id
 * @returns {(object|boolean)}
 * If no records found returns false
 * On success returns JSON.
 */
candidatesListsService.getListById = async (id) => {
  const candidatesList = await db.query(
    `
  SELECT
    CY.id, CY.year, C.name as listCode, C.id as listId, CY.enabled, CY.created
  FROM CourseYear as CY
  INNER JOIN Course C on CY.Course_id=C.id
  WHERE CY.id = ?;`,
    [id],
  );
  if (!candidatesList[0]) return false;
  return candidatesList[0];
};

/**
 * Updates the list with given id,
 * @param {object} list
 * @returns {boolean}
 * If no rows were updated returns false, on success returns true
 */
candidatesListsService.updateCandidateListById = async (list) => {
  const listToUpdate = {
    enabled: list.enabled,
  };
  const result = await db.query('UPDATE CourseYear SET ? WHERE id = ?', [
    listToUpdate,
    list.id,
  ]);
  if (result.affectedRows === 1) {
    return true;
  }
  return false;
};

candidatesListsService.deleteListById = async (id) => {
  const candidates = await candidatesService.getListCandidates(id);
  if (candidates.length > 0) {
    for (let index = 0; index < candidates.length; index += 1) {
      await db.query(
        `DELETE FROM InterviewResult_has_Tag 
          Where InterviewResult_id in 
          (SELECT iht.InterviewResult_id
        FROM InterviewResult_has_Tag iht
        INNER JOIN InterviewResult ir on ir.id=iht.InterviewResult_id
        Where ir.Candidate_id = ?);`,
        [candidates[index].id],
      );
      await db.query(
        `DELETE FROM InterviewResult WHERE Candidate_id = ?;
      `,
        [candidates[index].id],
      );
      await db.query('DELETE FROM CandidateAttachment WHERE candidate_id = ?', [
        candidates[index].id,
      ]);
    }
    await db.query('DELETE FROM ImportResult WHERE CourseYear_id = ?;', [id]);
    await db.query('DELETE FROM Candidate Where CourseYear_id = ?', [id]);
    await db.query('DELETE FROM CourseYear Where id = ?', [id]);
  }
  return true;
};

module.exports = candidatesListsService;
