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
  .get('/export/:id', isAdmin, candidatesListsController.exportList)
  .patch('/:id', isAdmin, candidatesListsController.updateCandidateListById)
  .post('/', isAdmin, candidatesListsController.uploadList)
  .delete('/:id', isAdmin, candidatesListsController.deleteList);

module.exports = router;
