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
      text as background
    FROM ImportResult
    WHERE Candidate_personal_id = ? and CourseYear_id = ?`,
    [personalId, courseYearId],
  );

  // if (result[0].background) {
  //   result[0].background = JSON.parse(result[0].background);
  // }

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
  let duplicatePersonalId;
  try {
    await db.query('START TRANSACTION;');
    if (!duplicatePersonalId) {
      Object.keys(jsonData).forEach(async (element) => {
        const data = jsonData[element];
        if (!duplicatePersonalId) {
          Object.keys(data).forEach(async (row) => {
            // Check dublicates
            if (!duplicatePersonalId) {
              if (data[row].Candidate_personal_id) {
                const duplicateResult = await candidatesResultsService.checkDBDublicates(
                  data[row].Candidate_personal_id,
                  courseYearId,
                );
                if (duplicateResult) {
                  duplicatePersonalId = data[row].Candidate_personal_id;
                }
              }
              if (!duplicatePersonalId) {
                data[row].CourseYear_id = courseYearId;
                await db.query('INSERT INTO ImportResult SET ?;', [data[row]]);
              }
            }
          });
        }
      });
    }
    if (!duplicatePersonalId) {
      await db.query('COMMIT;');
    } else {
      await db.query('ROLLBACK;');
    }
  } catch (err) {
    return {
      error: `Something went wrong while inserting the records into the database, ${err}`,
    };
  }
  if (duplicatePersonalId) {
    return {
      error: `Found dublicate presonalId(${duplicatePersonalId}), reverted the import!`,
    };
  }
  return true;
};

candidatesResultsService.getInterviewResultsByUserId = async (id, userId) => {
  const interviewResult = await db.query(
    `
  SELECT
    id,
    created, 
    comment, 
    interview_cat1 as interviewCat1,
    interview_cat2 as interviewCat2,
    interview_cat3 as interviewCat3,
    interview_cat4 as interviewCat4,
    interview_cat5 as interviewCat5,
    interview_cat6 as interviewCat6,
    interview_cat7 as interviewCat7,
    interview_cat8 as interviewCat8
  FROM InterviewResult
  WHERE Candidate_id = ? and User_id = ?;`,
    [id, userId],
  );
  if (interviewResult[0]) {
    const tags = await db.query(
      `SELECT 
    iht.Tag_id as id,
      t.name
  FROM InterviewResult_has_Tag iht
  INNER JOIN Tag t on iht.Tag_id = t.id
  WHERE iht.InterviewResult_id = ?;`,
      [interviewResult[0].id],
    );
    if (tags.length > 0) {
      Object.assign(interviewResult[0], { tags });
    }
  }
  return interviewResult[0];
};

candidatesResultsService.getCandidateInterviewResults = async (id) => {
  const interviewResults = await db.query(
    `
  SELECT
    id,
    created, 
    comment, 
    interview_cat1 as interviewCat1,
    interview_cat2 as interviewCat2,
    interview_cat3 as interviewCat3,
    interview_cat4 as interviewCat4,
    interview_cat5 as interviewCat5,
    interview_cat6 as interviewCat6,
    interview_cat7 as interviewCat7,
    interview_cat8 as interviewCat8
  FROM InterviewResult
  WHERE Candidate_id = ?;`,
    [id],
  );
  return interviewResults;
};

candidatesResultsService.updateInterviewResult = async (
  candidateId,
  userId,
  interviewResultId,
  interviewResult,
) => {
  const interviewToUpdate = {};
  if (interviewResult.comment) {
    interviewToUpdate.comment = interviewResult.comment;
  }
  if (interviewResult.interviewCat1) {
    interviewToUpdate.interview_Cat1 = interviewResult.interviewCat1;
  }
  if (interviewResult.interviewCat2) {
    interviewToUpdate.interview_Cat2 = interviewResult.interviewCat2;
  }
  if (interviewResult.interviewCat3) {
    interviewToUpdate.interview_Cat3 = interviewResult.interviewCat3;
  }
  if (interviewResult.interviewCat4) {
    interviewToUpdate.interview_Cat4 = interviewResult.interviewCat4;
  }
  if (interviewResult.interviewCat5) {
    interviewToUpdate.interview_Cat5 = interviewResult.interviewCat5;
  }
  if (interviewResult.interviewCat6) {
    interviewToUpdate.interview_Cat6 = interviewResult.interviewCat6;
  }
  if (interviewResult.interviewCat7) {
    interviewToUpdate.interview_Cat7 = interviewResult.interviewCat7;
  }
  if (interviewResult.interviewCat8) {
    interviewToUpdate.interview_Cat8 = interviewResult.interviewCat8;
  }
  if (Object.keys(interviewToUpdate).length > 0) {
    await db.query('START TRANSACTION;');
    const updateResult = await db.query(
      'UPDATE InterviewResult SET ? WHERE Candidate_id = ? and User_id = ?;',
      [interviewToUpdate, candidateId, userId],
    );
    if (updateResult.affectedRows === 1) {
      await db.query('COMMIT;');
    } else {
      await db.query('ROLLBACK;');
      return false;
    }
  }

  // Update the corresponding interview tags
  if (interviewResult.tags) {
    const deleteInterviewTags = await db.query(
      'DELETE FROM InterviewResult_has_Tag WHERE InterviewResult_id = ?;',
      [interviewResultId],
    );
    if (deleteInterviewTags) {
      const tagsInsert = await candidatesResultsService.insertInterviewResultTags(
        interviewResult.tags,
        interviewResultId,
      );
      if (tagsInsert.error) {
        return {
          error: tagsInsert.error,
        };
      }
    }
  }
  return true;
};

candidatesResultsService.insertInterviewResult = async (
  candidateId,
  userId,
  interviewResults,
) => {
  const interviewToInsert = {};
  interviewToInsert.Candidate_id = candidateId;
  interviewToInsert.User_id = userId;
  if (interviewResults.comment) {
    interviewToInsert.comment = interviewResults.comment;
  }
  if (interviewResults.interviewCat1) {
    interviewToInsert.interview_Cat1 = interviewResults.interviewCat1;
  }
  if (interviewResults.interviewCat2) {
    interviewToInsert.interview_Cat2 = interviewResults.interviewCat2;
  }
  if (interviewResults.interviewCat3) {
    interviewToInsert.interview_Cat3 = interviewResults.interviewCat3;
  }
  if (interviewResults.interviewCat4) {
    interviewToInsert.interview_Cat4 = interviewResults.interviewCat4;
  }
  if (interviewResults.interviewCat5) {
    interviewToInsert.interview_Cat5 = interviewResults.interviewCat5;
  }
  if (interviewResults.interviewCat6) {
    interviewToInsert.interview_Cat6 = interviewResults.interviewCat6;
  }
  if (interviewResults.interviewCat7) {
    interviewToInsert.interview_Cat7 = interviewResults.interviewCat7;
  }
  if (interviewResults.interviewCat8) {
    interviewToInsert.interview_Cat8 = interviewResults.interviewCat8;
  }
  await db.query('START TRANSACTION;');
  const insertResultSuccess = await db.query(
    'INSERT INTO InterviewResult SET ?',
    [interviewToInsert],
  );
  if (insertResultSuccess.affectedRows === 1 && insertResultSuccess.insertId) {
    await db.query('COMMIT;');
    if (interviewResults.tags) {
      const tagsInsert = await candidatesResultsService.insertInterviewResultTags(
        interviewResults.tags,
        insertResultSuccess.insertId,
      );
      if (tagsInsert.error) {
        return {
          error: tagsInsert.error,
        };
      }
    }
  } else {
    await db.query('ROLLBACK;');
    return {
      error:
        'An internal error occurred while trying to insert the candidate interview results',
    };
  }
  return true;
};

candidatesResultsService.insertInterviewResultTags = async (
  tags,
  interviewResultId,
) => {
  tags.forEach((id) => {
    db.query(
      'INSERT INTO InterviewResult_has_Tag (InterviewResult_id, Tag_id) VALUES (?,?)',
      [interviewResultId, id],
    );
  });
  return true;
};

candidatesResultsService.calculateScore = async (candidates) => {
  const newCandidates = [];

  for (let i = 0; i < candidates.length; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    const results = await candidatesResultsService.getCandidateInterviewResults(
      candidates[i].id,
    );
    const newRow = candidates[i];
    if (results.length > 0) {
      let interviewSum = 0;
      let finalScore = 0;

      // RIF calculations
      if (newRow.courseId === 1) {
        results.forEach((intRes) => {
          const tmpSum =
            (intRes.interviewCat1 +
              intRes.interviewCat2 +
              intRes.interviewCat3) *
            2.08333333333333;
          interviewSum += tmpSum;
        });
        interviewSum = Math.round(interviewSum);
        finalScore = newRow.testScore / 2 + interviewSum;
      }

      // LO calculations
      if (newRow.courseId === 2) {
        results.forEach((intRes) => {
          const tmpSum =
            intRes.interviewCat1 +
            intRes.interviewCat2 +
            intRes.interviewCat3 +
            intRes.interviewCat4;
          interviewSum += tmpSum;
        });
        interviewSum /= results.length;
        finalScore = newRow.testScore + interviewSum;
      }

      newRow.interviewScore = interviewSum;
      newRow.finalScore = finalScore;
    }
    newCandidates.push(newRow);
  }
  return newCandidates;
};

candidatesResultsService.checkDBDublicates = async (
  personalId,
  courseYearId,
) => {
  const match = await candidatesResultsService.getResultsByPersonalIdid(
    personalId,
    courseYearId,
  );
  if (match) {
    return match;
  }
  return false;
};

module.exports = candidatesResultsService;