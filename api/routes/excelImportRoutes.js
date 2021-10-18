const express = require('express');
const excelImportController = require('../controllers/excelImportController');
const { isLoggedIn, isAdmin } = require('../middlewares');
const cors = require('cors');
const fileUpload = require('express-fileupload');

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