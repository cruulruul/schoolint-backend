const { candidatesTagsService, coursesService } = require('../services');

const candidatesTagsController = {};

/**
 * Returns all tags from the database in JSON.
 * Example: "tags": [{id,name,courseId}]
 * @returns {any}
 * If no records found, empty JSON object "tags": []
 */
candidatesTagsController.getAllCandidatesTags = async (req, res) => {
  const tags = await candidatesTagsService.getAllCandidatesTags();
  res.status(200).json({ tags });
};

/**
 * Returns all given course tags from the database in JSON.
 * Example: "tags": [{id,name,courseId}]
 * @param {int} req.params.id
 * @returns {any}
 * If no records found, empty JSON object "tags": []
 */
candidatesTagsController.getTagsByCourseId = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const tags = await candidatesTagsService.getTagsByCourseId(id);
  res.status(200).json({ tags });
};

/**
 * Creates new tag into the database.
 * @param {string} req.body.name
 * @param {int} req.body.courseId
 * @returns {json}
 * If the required data is missing returns status code 400
 * and error message: "Required data is missing".
 * If the id is not returned from the servive returns status 500.
 * On success, returns JSON with new Id.
 */
candidatesTagsController.createTag = async (req, res) => {
  const { name, courseId } = req.body;
  if (!name || !courseId) {
    res.status(400).json('Required data missing');
  }

  const validCourse = await coursesService.getCourseById(courseId);
  if (!validCourse) {
    return res.status(404).json({
      error: `Course with id, ${courseId}, does not exist in the database`,
    });
  }

  const existingTag = await candidatesTagsService.getTagByName(name, courseId);
  if (existingTag) {
    return res.status(409).json({
      error: `Tag with name, ${name}, already exists in this course`,
    });
  }

  const newTag = {
    name,
    courseId,
  };
  const id = await candidatesTagsService.createTag(newTag);
  if (!id) {
    return res.status(500).json({
      error: 'Unable to insert the tag record into the database',
    });
  }
  return res.status(201).json({
    id,
  });
};

/**
 * Deletes single tag record by Id from the database.
 * @param {int} req.params.id
 * If no tag found with the given id, returns status code 404 and error message.
 * If deleting fails, returns status code 500 and error message.
 * On success, returns 204.
 */
candidatesTagsController.deleteTagById = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const tag = await candidatesTagsService.getTagById(id);
  if (!tag) {
    return res.status(404).json({
      error: `No tag found with id: ${id}`,
    });
  }
  const success = await candidatesTagsService.deleteTagById(id);
  if (!success) {
    return res.status(500).json({
      error: 'Something went wrong while deleting the tag',
    });
  }
  return res.status(204).end();
};

module.exports = candidatesTagsController;
