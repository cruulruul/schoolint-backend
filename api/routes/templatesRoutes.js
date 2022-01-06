const express = require('express');
const cors = require('cors');
const { templatesController } = require('../controllers');
const { isLoggedIn, isAdmin } = require('../middlewares');

const router = express.Router();

/**
 * Templates API endpoints
 */
router
  .use(cors())
  .use(isLoggedIn)
  .get('/', isAdmin, templatesController.getTemplates)
  .get('/:id', isAdmin, templatesController.getTemplateById)
  .post('/', isAdmin, templatesController.createTemplates)
  .delete('/:id', isAdmin, templatesController.deleteTemplateById);

module.exports = router;
