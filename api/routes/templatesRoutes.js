const express = require('express');
const cors = require('cors');
const { templatesController } = require('../controllers');
const { isLoggedIn, isAdmin } = require('../middlewares');

const router = express.Router();

/**
 * templates API endpoints
 */
router
  .use(isLoggedIn) // Nii kaua kui kasutajaid pole rakendusse lisatud, kommenteeri välja
  .use(cors())
  .get('/', templatesController.getTemplates)
  .get('/:id', templatesController.getTemplateById)
  .post('/', templatesController.createTemplates)
  .patch('/:id', templatesController.updateTemplate)
  .delete('/:id', isAdmin, templatesController.deleteTemplateById);

module.exports = router;
