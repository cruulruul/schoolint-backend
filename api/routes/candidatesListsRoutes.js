const express = require('express');
const cors = require('cors');
const { candidatesListsController } = require('../controllers');
// const { isLoggedIn } = require('../middlewares');

const router = express.Router();

/**
 * candidatesLists API endpoint
 */
router
  // .use(isLoggedIn)
  .use(cors())
  .get('/', candidatesListsController.getAllCandidatesLists);

module.exports = router;
