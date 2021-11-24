const express = require('express');
const candidatesListsController = require('../controllers/candidatesListController');
const { isLoggedIn, isAdmin } = require('../middlewares');
const cors = require('cors');

const router = express.Router();

/**
 * candidatesLists API endpoint
 */
router
//   .isLoggedIn()
  .use(cors())
  .get('/', candidatesListsController.getAllCandidatesLists);

module.exports = router;