const express = require('express');
const cors = require('cors');
const { candidatesController } = require('../controllers');
const { isAdmin } = require('../middlewares');

const router = express.Router();

/**
 * candidates API endpoints
 */
router
  // .use(isLoggedIn) // Nii kaua kui kasutajaid pole rakendusse lisatud, kommenteeri välja
  .use(cors())
  .get('/', candidatesController.getCandidates)
  .get('/:id', candidatesController.getCandidateById)
  .patch('/:id', candidatesController.updateCandidate)
  .delete('/:id', isAdmin, candidatesController.deleteCandidateById);

module.exports = router;
