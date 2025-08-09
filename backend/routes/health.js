const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const os = require('os');

// Basic health check
router.get('/', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV
  });
});

// Detailed health check (for monitoring)
router.get('/detailed', async (req, res) => {
  try {
    const healthCheck = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      server: {
        platform: os.platform(),
        release: os.release(),
        totalMemory: os.totalmem(),
        freeMemory: os.freemem(),
        cpus: os.cpus().length,
        loadAverage: os.loadavg(),
        hostname: os.hostname()
      },
      process: {
        pid: process.pid,
        version: process.version,
        memoryUsage: process.memoryUsage(),
        cpuUsage: process.cpuUsage()
      },
      database: {
        status: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        host: mongoose.connection.host,
        name: mongoose.connection.name
      },
      redis: {
        status: req.app.locals.redis ? 'connected' : 'not configured'
      }
    };

    // Check database connection
    if (mongoose.connection.readyState === 1) {
      const adminDb = mongoose.connection.db.admin();
      const dbStats = await adminDb.serverStatus();
      healthCheck.database.version = dbStats.version;
      healthCheck.database.uptime = dbStats.uptime;
    }

    res.json(healthCheck);
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Readiness check (for k8s)
router.get('/ready', async (req, res) => {
  try {
    // Check MongoDB connection
    if (mongoose.connection.readyState !== 1) {
      throw new Error('Database not connected');
    }

    // Check Redis if enabled
    if (process.env.ENABLE_REDIS_CACHE === 'true' && !req.app.locals.redis) {
      throw new Error('Redis not connected');
    }

    res.json({
      ready: true,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({
      ready: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Liveness check (for k8s)
router.get('/live', (req, res) => {
  res.json({
    alive: true,
    timestamp: new Date().toISOString()
  });
});

module.exports = router;