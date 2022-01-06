const express = require('express');
const cors = require('cors');
const { candidatesListsController } = require('../controllers');
const { isAdmin, isLoggedIn } = require('../middlewares');

const router = express.Router();

/**
 * Candidates lists API endpoints
 */
router
  .use(cors())
  .use(isLoggedIn)
  .get('/', isAdmin, candidatesListsController.getAllCandidatesLists)
  .patch('/:id', candidatesListsController.updateCandidateListById)
  .post('/', candidatesListsController.uploadList);
// TODO Deleting the list with all candidates, result etc
// .delete('/:id', candidatesListsController.deleteList)

module.exports = router;
