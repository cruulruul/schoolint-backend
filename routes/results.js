const express = require('express');
const router = express.Router();

/* GET results listing. */
router.get('/', function(req, res) {
    res.send('respond with a resource');
});

module.exports = router;
