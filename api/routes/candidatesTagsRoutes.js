const express = require('express');
const cors = require('cors');
const { candidatesTagsController } = require('../controllers');
const { isAdmin } = require('../middlewares');

const router = express.Router();

router
  // .use(isLoggedIn)
  .use(cors())
  .get('/', candidatesTagsController.getAllCandidatesTags)
  // .get('/', isAdmin, candidatesTagsController.getAllCandidatesTags)
  .post('/', isAdmin, candidatesTagsController.createTag)
  .patch('/:id', isAdmin, candidatesTagsController.updateTag);

module.exports = router;
