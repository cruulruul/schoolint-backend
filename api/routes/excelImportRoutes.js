const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const { excelImportController } = require('../controllers');
const { isLoggedIn } = require('../middlewares');

const router = express.Router();

/**
 * excel import API endpoint
 */
router
  .use(isLoggedIn) // Nii kaua kui kasutajaid pole rakendusse lisatud, kommenteeri välja
  .use(cors())
  .use(fileUpload())
  .post('/', excelImportController.saveExcel);

module.exports = router;
