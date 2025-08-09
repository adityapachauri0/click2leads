const express = require('express');
const router = express.Router();
const trackingController = require('../controllers/trackingController');
const { verifyAdmin } = require('../middleware/auth');
const rateLimit = require('express-rate-limit');

// Rate limiting for tracking endpoints
const trackingLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute
  message: 'Too many tracking requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false
});

// Public tracking endpoints (no auth required)
router.post('/visitor', trackingLimiter, trackingController.trackVisitor);
router.post('/event', trackingLimiter, trackingController.trackEvent);
router.post('/identify', trackingLimiter, trackingController.identifyVisitor);
router.post('/capture-field', trackingLimiter, trackingController.captureFieldData);

// Admin endpoints (auth required)
router.get('/analytics', verifyAdmin, trackingController.getVisitorAnalytics);
router.get('/visitor/:visitorId', verifyAdmin, trackingController.getVisitorDetails);
router.get('/export', verifyAdmin, trackingController.exportVisitors);
router.delete('/visitors/bulk', verifyAdmin, trackingController.bulkDeleteVisitors);

// Public endpoint to view captured data (for demo)
router.get('/captured-data', trackingController.getCapturedFormData);

module.exports = router;