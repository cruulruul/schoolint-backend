const { coursesService, candidatesTagsService } = require('../services');

const coursesController = {};

/**
 * Returns all courses from the database in JSON.
 * Example: "courses": [{id,name}]
 * @returns {any}
 * If no records found, empty JSON object "tags": []
 */
coursesController.getAllCourses = async (req, res) => {
  const courses = await coursesService.getAllCourses();
  res.status(200).json({ courses });
};

/**
 * Returns course by id from the database in JSON.
 * Example: "course": [{id,name}]
 * @param {int} req.params.id
 * @returns {object}
 * If no records found, error 404
 * On success, returns JSON
 */
coursesController.getCourseById = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const course = await coursesService.getCourseById(id);
  if (!course) {
    return res.status(404).json({
      error: `No course found with id: ${id}`,
    });
  }
  return res.status(200).json({
    course,
  });
};

/**
 * Creates new course into the database.
 * @param {string} req.body.name
 * @returns {object}
 * If the required data is missing returns status code 400
 * and error message: "Required data is missing".
 * If the id is not returned from the servive returns status 500.
 * On success, returns JSON with new Id.
 */
coursesController.createCourse = async (req, res) => {
  const { name, templateId } = req.body;
  if (!name || !templateId) {
    return res
      .status(400)
      .json({ error: 'Required data "name" or "templateId" is missing' });
  }

  const existingCourse = await coursesService.getCourseByName(name);
  if (existingCourse) {
    return res.status(409).json({
      error: `Course with name, ${name}, already exists in the database`,
    });
  }
  const id = await coursesService.createCourse(name, templateId);
  if (!id) {
    return res.status(500).json({
      error: 'Unable to insert the course record into the database',
    });
  }
  return res.status(201).json({
    id,
  });
};

/**
 * Deletes single course record by Id from the database.
 * @param {int} req.params.id
 * If no course found with the given id, returns status code 404 and error message.
 * If deleting fails, returns status code 500 and error message.
 * On success, returns 204.
 */
coursesController.deleteCourseById = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const course = await coursesService.getCourseById(id);
  if (!course) {
    return res.status(404).json({
      error: `No course found with id: ${id}`,
    });
  }

  const usedByTags = await candidatesTagsService.getTagsByCourseId(id);
  if (usedByTags[0]) {
    return res.status(400).json({
      error: 'Unable to delete the course, used by tags!',
    });
  }

  const success = await coursesService.deleteCourseById(id);
  if (!success) {
    return res.status(500).json({
      error: 'Something went wrong while deleting the course',
    });
  }
  return res.status(204).end();
};

module.exports = coursesController;
