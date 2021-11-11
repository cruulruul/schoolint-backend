const express = require('express');
const cors = require('cors');
const { uploadController } = require('../controllers');
// const { isLoggedIn } = require('../middlewares');

const router = express.Router();

/**
 * results API endpoints
 */
router
  // .use(isLoggedIn) // Nii kaua kui kasutajaid pole rakendusse lisatud, kommenteeri välja
  .use(cors())
  .post('/', uploadController.upload);

module.exports = router;
