const crypto = require('crypto');

// Store CSRF tokens (in production, use Redis or similar)
const csrfTokens = new Map();

// Generate CSRF token
const generateCSRFToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Get or create CSRF token for session
exports.getCSRFToken = (req, res) => {
  try {
    // Use session ID or IP as identifier
    const sessionId = req.sessionID || req.ip || 'default';
    
    // Check if token exists and is still valid (24 hours)
    const existingToken = csrfTokens.get(sessionId);
    if (existingToken && existingToken.expires > Date.now()) {
      return res.json({
        success: true,
        csrfToken: existingToken.token
      });
    }
    
    // Generate new token
    const token = generateCSRFToken();
    csrfTokens.set(sessionId, {
      token,
      expires: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
    });
    
    // Clean up expired tokens periodically
    if (Math.random() < 0.1) { // 10% chance to clean up
      for (const [key, value] of csrfTokens.entries()) {
        if (value.expires < Date.now()) {
          csrfTokens.delete(key);
        }
      }
    }
    
    res.json({
      success: true,
      csrfToken: token
    });
  } catch (error) {
    console.error('CSRF token generation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate CSRF token'
    });
  }
};

// Validate CSRF token
exports.validateCSRF = (req, res, next) => {
  try {
    // Skip CSRF for GET requests
    if (req.method === 'GET') {
      return next();
    }
    
    // Get token from header or body
    const token = req.headers['x-csrf-token'] || 
                  req.body._csrf || 
                  req.query._csrf;
    
    if (!token) {
      return res.status(403).json({
        success: false,
        message: 'CSRF token missing'
      });
    }
    
    // Use session ID or IP as identifier
    const sessionId = req.sessionID || req.ip || 'default';
    const storedToken = csrfTokens.get(sessionId);
    
    if (!storedToken || storedToken.token !== token) {
      return res.status(403).json({
        success: false,
        message: 'Invalid CSRF token'
      });
    }
    
    if (storedToken.expires < Date.now()) {
      csrfTokens.delete(sessionId);
      return res.status(403).json({
        success: false,
        message: 'CSRF token expired'
      });
    }
    
    next();
  } catch (error) {
    console.error('CSRF validation error:', error);
    res.status(500).json({
      success: false,
      message: 'CSRF validation failed'
    });
  }
};

// Optional: Middleware to automatically inject CSRF token in responses
exports.injectCSRFToken = (req, res, next) => {
  const sessionId = req.sessionID || req.ip || 'default';
  const existingToken = csrfTokens.get(sessionId);
  
  if (!existingToken || existingToken.expires < Date.now()) {
    const token = generateCSRFToken();
    csrfTokens.set(sessionId, {
      token,
      expires: Date.now() + (24 * 60 * 60 * 1000)
    });
    res.locals.csrfToken = token;
  } else {
    res.locals.csrfToken = existingToken.token;
  }
  
  next();
};