const express = require('express');
const router = express.Router();
const { getCSRFToken } = require('../middleware/csrf');

// Get CSRF token endpoint
router.get('/token', getCSRFToken);

module.exports = router;