const express = require('express');
const cors = require('cors');
const { candidatesListsController } = require('../controllers');

const router = express.Router();

router
  // .use(isLoggedIn)
  .use(cors())
  .get('/', candidatesListsController.getAllCandidatesLists)
  .post('/', candidatesListsController.uploadList);

module.exports = router;
