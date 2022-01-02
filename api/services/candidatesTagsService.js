const db = require('../../db');

const candidatesTagsService = {};

/**
 * Returns all tags from database in JSON.
 * @returns {json}
 */
candidatesTagsService.getAllCandidatesTags = async () => {
  const tags = await db.query(`
    SELECT 
      id, name, Course_id as courseId
    FROM Tag`);
  return tags;
};

/**
 * Returns all course tags from database by course id in JSON.
 * @param {int} id
 * @returns {json}
 */
candidatesTagsService.getTagsByCourseId = async (id) => {
  const tags = await db.query(
    `
    SELECT 
      id, name, Course_id as courseId
    FROM Tag
    WHERE Course_id = ?`,
    [id],
  );
  return tags;
};

/**
 * Single tag query from the database by id.
 * @param {int} id
 * @returns {json}
 * If no records found returns false.
 * On success returns JSON.
 */
candidatesTagsService.getTagById = async (id) => {
  const tag = await db.query(
    `
  SELECT 
    id, name, Course_id as courseId
  FROM Tag
  WHERE id = ?`,
    [id],
  );
  if (!tag[0]) return false;
  return tag[0];
};

/**
 * Single course tag query from the database by name.
 * @param {string} id
 * @param {int} courseId
 * @returns {json}
 * If no records found returns false.
 * On success returns JSON.
 */
candidatesTagsService.getTagByName = async (name, courseId) => {
  const tag = await db.query(
    `
  SELECT 
    id, name, Course_id as courseId
  FROM Tag
  WHERE name = ? and Course_id = ?;`,
    [name, courseId],
  );
  if (!tag[0]) return false;
  return tag[0];
};

/**
 * Insert query, new tag into the database.
 * @param {json} newTag
 * @returns {json}
 * Returns JSON, new tag Id
 */
candidatesTagsService.createTag = async (newTag) => {
  const tag = {
    name: newTag.name,
    Course_id: newTag.courseId,
  };
  const result = await db.query('INSERT INTO Tag SET ?', [tag]);
  return result.insertId;
};

/**
 * Delete query, remove tag by id
 * @param {int} id
 * @returns {boolean}
 * If rowcount is not 1, return false.
 * On success return true.
 */
candidatesTagsService.deleteTagById = async (id) => {
  const result = await db.query('DELETE FROM Tag WHERE id = ?;', [id]);
  if (result.affectedRows === 1) {
    return true;
  }
  return false;
};

module.exports = candidatesTagsService;
