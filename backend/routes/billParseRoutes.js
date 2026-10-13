const express = require('express');
const { parseBill } = require('../controllers/billParseController');

const router = express.Router();
router.post('/api/parse-bill', parseBill);

module.exports = router;
