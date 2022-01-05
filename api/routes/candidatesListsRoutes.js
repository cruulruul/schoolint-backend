const express = require('express');
const cors = require('cors');
const { candidatesListsController } = require('../controllers');

const router = express.Router();

router
  // .use(isLoggedIn)
  .use(cors())
  .get('/', candidatesListsController.getAllCandidatesLists)
  .patch('/:id', candidatesListsController.updateCandidateListById)
  .post('/', candidatesListsController.uploadList);
// TODO Deleting the list with all candidates, result etc
// .delete('/:id', candidatesListsController.deleteList)

module.exports = router;
