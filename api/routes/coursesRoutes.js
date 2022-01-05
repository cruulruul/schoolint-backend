const express = require('express');
const cors = require('cors');
const { coursesController } = require('../controllers');
const { isAdmin, isLoggedIn } = require('../middlewares');

const router = express.Router();

/**
 * Courses tags API endpoints
 */
router
  .use(cors())
  .use(isLoggedIn)
  .get('/', isAdmin, coursesController.getAllCourses)
  .get('/:id', isAdmin, coursesController.getCourseById)
  .post('/', isAdmin, coursesController.createCourse)
  .delete('/:id', isAdmin, coursesController.deleteCourseById);

module.exports = router;
