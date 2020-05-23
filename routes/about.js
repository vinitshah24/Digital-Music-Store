const path = require('path');
const express = require('express');

const aboutController = require('../controllers/about');

const router = express.Router();

router.get('/about', aboutController.getIndex);

module.exports = router;
