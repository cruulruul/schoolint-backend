const express = require('express');
const candidatesController = require('../controllers/candidatesController');
const { isLoggedIn, isAdmin } = require('../middlewares');

const router = express.Router();

/**
 * candidates API endpoints
 */
router
  .use(isLoggedIn)
  .get('/', candidatesController.getCandidates)
  .get('/:id', candidatesController.getCandidateById)
  .post('/', candidatesController.createCandidates)
  .patch('/:id', candidatesController.updateCandidate)
  .delete('/:id', isAdmin, candidatesController.deleteCandidateById);

module.exports = router;
