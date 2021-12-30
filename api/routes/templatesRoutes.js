const express = require('express');
const cors = require('cors');
const { templatesController } = require('../controllers');
const { isLoggedIn, isAdmin } = require('../middlewares');

const router = express.Router();

/**
 * templates API endpoints
 */
router
  // .use(isLoggedIn) // Nii kaua kui kasutajaid pole rakendusse lisatud, kommenteeri välja
  .use(cors())
  .get('/', templatesController.getTemplates)
  .get('/:id', templatesController.getTemplateById)
  .post('/', templatesController.createTemplates)
  .delete('/:id', templatesController.deleteTemplateById);

module.exports = router;
