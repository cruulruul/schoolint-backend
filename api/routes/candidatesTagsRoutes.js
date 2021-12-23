const express = require('express');
const cors = require('cors');
const { candidatesTagsController } = require('../controllers');
const { isLoggedIn, isAdmin } = require('../middlewares');

const router = express.Router();

router
  .use(isLoggedIn)
  .use(cors())
  .get('/', isAdmin, candidatesTagsController.getAllCandidatesTags)
  .post('/', isAdmin, candidatesTagsController.createTag)
  .patch('/:id', isAdmin, candidatesTagsController.updateTag);

module.exports = router;
