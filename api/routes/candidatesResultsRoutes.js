const express = require('express');
const cors = require('cors');
const { candidatesResultsController } = require('../controllers');
const { isLoggedIn, isAdmin } = require('../middlewares');

const router = express.Router();

/**
 * Results API endpoints
 */
router
  .use(cors())
  .use(isLoggedIn)
  .post('/', isAdmin, candidatesResultsController.uploadResults);

module.exports = router;
