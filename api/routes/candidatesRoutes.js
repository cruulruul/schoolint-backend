const express = require('express');
const cors = require('cors');
const { candidatesController } = require('../controllers');
const { isLoggedIn } = require('../middlewares');

const router = express.Router();

/**
 * Candidates API endpoints
 */
router
  .use(cors())
  .use(isLoggedIn)
  .get('/', candidatesController.getCandidates)
  .get('/:id', candidatesController.getCandidateById)
  .patch('/:id', candidatesController.updateCandidate)
  .post('/attachment', candidatesController.uploadAttachment)
  .get('/attachment/:id', candidatesController.getAttachmentFile)
  .delete('/attachment', candidatesController.deleteAttachment);

module.exports = router;
