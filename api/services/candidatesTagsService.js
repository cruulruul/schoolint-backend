const db = require('../../db');

const candidatesTagsService = {};

/**
 * Returns all tags from database in JSON.
 * @returns {object}
 */
candidatesTagsService.getAllCandidatesTags = async () => {
  const tags = await db.query(`
    SELECT 
      t.id, t.name, t.Course_id as courseId, c.name as specialityCode
    FROM schoolint.Tag t
    INNER JOIN schoolint.Course c on t.Course_id = c.id
    WHERE t.deleted = 0;`);
  return tags;
};

/**
 * Returns all course tags from database by course id in JSON.
 * @param {int} id
 * @returns {object}
 */
candidatesTagsService.getTagsByCourseId = async (id) => {
  const tags = await db.query(
    `
    SELECT 
      t.id, t.name, t.Course_id as courseId, c.name as specialityCode
    FROM schoolint.Tag t
    INNER JOIN schoolint.Course c on t.Course_id = c.id
    WHERE t.deleted = 0 and t.Course_id = ?`,
    [id],
  );
  return tags;
};

/**
 * Single tag query from the database by id.
 * @param {int} id
 * @returns {object}
 * If no records found returns false.
 * On success returns JSON.
 */
candidatesTagsService.getTagById = async (id) => {
  const tag = await db.query(
    `
  SELECT 
    id, name, Course_id as courseId, deleted
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
 * @returns {object}
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
 * @param {object} newTag
 * @returns {object}
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
 * Delete query, set tag deleted by id
 * @param {int} id
 * @returns {boolean}
 * If rowcount is not 1, return false.
 * On success return true.
 */
candidatesTagsService.deleteTagById = async (id) => {
  const result = await db.query('UPDATE Tag SET deleted = 1 WHERE id = ?;', [
    id,
  ]);
  if (result.affectedRows === 1) {
    return true;
  }
  return false;
};

module.exports = candidatesTagsService;
