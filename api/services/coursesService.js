const db = require('../../db');

const coursesService = {};

/**
 * Returns all courses from database in JSON.
 * @returns {json}
 */
coursesService.getAllCourses = async () => {
  const courses = await db.query(`
    SELECT 
      id, name
    FROM Course;`);
  return courses;
};

/**
 * Single course query from the database by id.
 * @param {int} id
 * @returns {json}
 * If no records found returns false.
 * On success returns JSON.
 */
coursesService.getCourseById = async (id) => {
  const course = await db.query(
    `
  SELECT 
    id, name
  FROM Course
  WHERE id = ?;`,
    [id],
  );
  if (!course[0]) return false;
  return course[0];
};

/**
 * Single course query from the database by name.
 * @param {string} name
 * @returns {json}
 * If no records found returns false.
 * On success returns JSON.
 */
coursesService.getCourseByName = async (name) => {
  const course = await db.query(
    `
    SELECT 
      id, name
    FROM Course
    WHERE name = ?;`,
    [name],
  );
  if (!course[0]) return false;
  return course[0];
};

/**
 * Insert query, new course into the database.
 * @param {string} name
 * @returns {json}
 * Returns JSON, new tag Id
 */
coursesService.createCourse = async (name) => {
  const result = await db.query('INSERT INTO Course (name) VALUES (?)', [name]);
  return result.insertId;
};

/**
 * Insert query, new course year into database
 * @param {int} courseId
 * @param {int} year
 * @returns {int} On success: returns inserted row id
 */
coursesService.createCourseYear = async (courseId, year) => {
  const result = await db.query(
    'INSERT INTO CourseYear (Course_id, year) VALUES (?,?);',
    [courseId, year],
  );
  return result.insertId;
};

/**
 * Delete query, remove course by id
 * @param {int} id
 * @returns {boolean}
 * If rowcount is not 1, return false.
 * On success return true.
 */
coursesService.deleteCourseById = async (id) => {
  const result = await db.query('DELETE FROM Course WHERE id = ?;', [id]);
  if (result.affectedRows === 1) {
    return true;
  }
  return false;
};

module.exports = coursesService;
