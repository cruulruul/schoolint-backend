const express = require('express');
const cors = require('cors');
const { candidatesTagsController } = require('../controllers');
// const { isAdmin, isLoggedin } = require('../middlewares');

const router = express.Router();

router
  // .use(isLoggedIn)
  .use(cors())
  .get('/', candidatesTagsController.getAllCandidatesTags)
  .get('/coursetags/:id', candidatesTagsController.getTagsByCourseId)
  .post('/', candidatesTagsController.createTag)
  .delete('/:id', candidatesTagsController.deleteTagById);

module.exports = router;
