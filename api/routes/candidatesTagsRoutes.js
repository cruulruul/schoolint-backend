const express = require('express');
const cors = require('cors');
const { candidatesTagsController } = require('../controllers');
const { isAdmin, isLoggedIn } = require('../middlewares');

const router = express.Router();

/**
 * Candidates tags API endpoints
 */
router
  .use(cors())
  .use(isLoggedIn)
  .get('/', candidatesTagsController.getAllCandidatesTags)
  .get('/coursetags/:id', candidatesTagsController.getTagsByCourseId)
  .post('/', isAdmin, candidatesTagsController.createTag)
  .delete('/:id', isAdmin, candidatesTagsController.deleteTagById);

module.exports = router;
