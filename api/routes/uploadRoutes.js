const express = require('express');
const cors = require('cors');
const { uploadController } = require('../controllers');
const { isLoggedIn } = require('../middlewares');

const router = express.Router();

/**
 * Uploads API endpoints
 */
router.use(cors()).use(isLoggedIn).post('/', uploadController.upload); // candidateId
// .delete ('/:id'), uploadController.deleteFile);

module.exports = router;
