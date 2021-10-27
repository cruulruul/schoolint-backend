const express = require('express');
const cors = require('cors');
const { resultsController } = require('../controllers');
const { isLoggedIn, isAdmin } = require('../middlewares');

const router = express.Router();

/**
 * results API endpoints
 */
router
  .use(isLoggedIn) // Nii kaua kui kasutajaid pole rakendusse lisatud, kommenteeri välja
  .use(cors())
  .get('/', resultsController.getResults)
  .get('/:id', resultsController.getResultById)
  .post('/', resultsController.createResults)
  .patch('/:id', resultsController.updateResult)
  .delete('/:id', isAdmin, resultsController.deleteResultById);

module.exports = router;
