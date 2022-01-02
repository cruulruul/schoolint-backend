const express = require('express');
const cors = require('cors');
const { coursesController } = require('../controllers');
// const { isAdmin, isLoggedin } = require('../middlewares');

const router = express.Router();

router
  // .use(isLoggedIn)
  .use(cors())
  .get('/', coursesController.getAllCourses)
  .get('/:id', coursesController.getCourseById)
  .post('/', coursesController.createCourse)
  .delete('/:id', coursesController.deleteCourseById);

module.exports = router;
