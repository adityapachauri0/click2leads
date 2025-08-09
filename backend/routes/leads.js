const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Lead = require('../models/Lead');
const { authMiddleware } = require('../middleware/auth');
const emailService = require('../services/emailService');
const { cacheMiddleware } = require('../config/redis');

// Validation rules
const leadValidation = [
  body('name').trim().isLength({ min: 2 }).withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('phone').optional().matches(/^[\+]?[0-9]{10,11}$/).withMessage('Phone number must be 10 or 11 digits'),
  body('company').optional().trim(),
  body('budget').optional().trim(),
  body('message').optional().trim(),
  body('service').trim().notEmpty().withMessage('Service is required')
];

// Submit lead form
router.post('/submit', leadValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false, 
      errors: errors.array() 
    });
  }

  try {
    const { name, email, company, phone, budget, message, service, source, visitorId } = req.body;
    const getClientIp = require('../utils/getClientIp');
    const axios = require('axios');
    
    // Get IP address
    let ipAddress = getClientIp(req);
    
    // If localhost, try to get public IP for testing
    if (ipAddress === '::1' || ipAddress === '127.0.0.1' || ipAddress === '::ffff:127.0.0.1') {
      try {
        const response = await axios.get('https://api.ipify.org?format=json', { timeout: 2000 });
        ipAddress = response.data.ip || ipAddress;
      } catch (error) {
        console.log('Could not fetch public IP, using local:', ipAddress);
      }
    }
    
    const userAgent = req.get('user-agent');
    
    // Calculate lead score based on various factors
    let score = 50; // Base score
    if (budget && budget.includes('25,000+')) score += 30;
    else if (budget && budget.includes('10,000')) score += 25;
    else if (budget && budget.includes('5,000')) score += 20;
    else if (budget && budget.includes('1,000')) score += 10;
    
    if (company) score += 10;
    if (phone) score += 10;
    if (message && message.length > 50) score += 10;
    
    // Parse user agent for device info
    const deviceInfo = {
      deviceType: userAgent && userAgent.includes('Mobile') ? 'mobile' : 'desktop',
      os: userAgent && userAgent.includes('Windows') ? 'Windows' : 
          userAgent && userAgent.includes('Mac') ? 'macOS' : 
          userAgent && userAgent.includes('Linux') ? 'Linux' : 'Unknown',
      browser: userAgent && userAgent.includes('Chrome') ? 'Chrome' :
               userAgent && userAgent.includes('Safari') ? 'Safari' :
               userAgent && userAgent.includes('Firefox') ? 'Firefox' : 'Other'
    };
    
    // Create new lead
    const newLead = new Lead({
      name,
      email,
      company: company || undefined,
      phone: phone || undefined,
      budget: budget || undefined,
      message: message || undefined,
      service,
      source: source || 'Website Form',
      score: Math.min(score, 100),
      ipAddress,
      device: deviceInfo,
      visitorId: visitorId || undefined,
      userAgent
    });
    
    await newLead.save();
    
    // Update visitor status to lead if we have a visitorId
    if (visitorId) {
      try {
        const Visitor = require('../models/Visitor');
        await Visitor.findOneAndUpdate(
          { visitorId },
          { 
            status: 'lead',
            email: email,
            name: name,
            phone: phone,
            $push: {
              conversions: {
                type: 'lead_created',
                value: { leadId: newLead._id },
                timestamp: new Date()
              }
            }
          }
        );
      } catch (visitorError) {
        console.log('Visitor update error (non-critical):', visitorError.message);
        // Continue - visitor update is not critical for lead submission
      }
    }
    
    // Send email notifications if enabled
    if (process.env.ENABLE_EMAIL_NOTIFICATIONS === 'true') {
      // Send confirmation to lead
      await emailService.sendLeadConfirmation(newLead);
      
      // Send notification to admin
      await emailService.sendLeadNotification(newLead);
    }
    
    // Clear cache
    if (req.app.locals.redis) {
      await req.app.locals.redis.del('cache:leads:stats');
    }
    
    res.status(201).json({
      success: true,
      message: 'Thank you for contacting us! We will get back to you soon.',
      leadId: newLead._id
    });
  } catch (error) {
    console.error('Error submitting lead:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit your request. Please try again.'
    });
  }
});

// Get all leads (admin only)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { status, service, source, dateFrom, dateTo, sortBy = 'createdAt', order = 'desc' } = req.query;
    
    // Build query
    const query = {};
    if (status) query.status = status;
    if (service) query.service = service;
    if (source) query.source = source;
    if (dateFrom || dateTo) {
      query.createdAt = {};
      if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
      if (dateTo) query.createdAt.$lte = new Date(dateTo);
    }
    
    // Execute query with sorting
    const leads = await Lead.find(query)
      .sort({ [sortBy]: order === 'desc' ? -1 : 1 })
      .limit(100);
    
    res.json({
      success: true,
      leads,
      total: leads.length
    });
  } catch (error) {
    console.error('Error fetching leads:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch leads'
    });
  }
});

// Get lead by ID (admin only)
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    
    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }
    
    res.json({
      success: true,
      lead
    });
  } catch (error) {
    console.error('Error fetching lead:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch lead'
    });
  }
});

// Update lead status (admin only)
router.patch('/:id/status', authMiddleware, [
  body('status').isIn(['new', 'contacted', 'qualified', 'converted', 'lost']).withMessage('Invalid status')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { status } = req.body;
    
    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { 
        status,
        lastStatusUpdate: new Date()
      },
      { new: true }
    );
    
    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }
    
    // Clear cache
    if (req.app.locals.redis) {
      await req.app.locals.redis.del('cache:leads:stats');
    }
    
    res.json({
      success: true,
      message: 'Lead status updated',
      lead
    });
  } catch (error) {
    console.error('Error updating lead status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update lead status'
    });
  }
});

// Add note to lead (admin only)
router.post('/:id/notes', authMiddleware, [
  body('content').trim().notEmpty().withMessage('Note content is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { content } = req.body;
    
    const lead = await Lead.findById(req.params.id);
    
    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }
    
    lead.notes.push({
      content,
      addedBy: req.userId,
      addedAt: new Date()
    });
    
    await lead.save();
    
    res.json({
      success: true,
      message: 'Note added successfully',
      lead
    });
  } catch (error) {
    console.error('Error adding note:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add note'
    });
  }
});

// Get lead statistics
router.get('/stats/overview', async (req, res) => {
  try {
    // Try to get from cache first
    if (req.app.locals.redis) {
      const cached = await req.app.locals.redis.get('cache:leads:stats');
      if (cached) {
        return res.json(JSON.parse(cached));
      }
    }
    
    // Calculate statistics
    const [
      total,
      newCount,
      contactedCount,
      qualifiedCount,
      convertedCount,
      lostCount,
      todayCount,
      weekCount,
      monthCount
    ] = await Promise.all([
      Lead.countDocuments(),
      Lead.countDocuments({ status: 'new' }),
      Lead.countDocuments({ status: 'contacted' }),
      Lead.countDocuments({ status: 'qualified' }),
      Lead.countDocuments({ status: 'converted' }),
      Lead.countDocuments({ status: 'lost' }),
      Lead.countDocuments({ 
        createdAt: { $gte: new Date().setHours(0, 0, 0, 0) } 
      }),
      Lead.countDocuments({ 
        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } 
      }),
      Lead.countDocuments({ 
        createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } 
      })
    ]);
    
    // Get conversion rate
    const conversionRate = total > 0 ? ((convertedCount / total) * 100).toFixed(1) : 0;
    
    // Get top sources
    const topSources = await Lead.aggregate([
      { $group: { _id: '$source', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);
    
    // Get top services
    const topServices = await Lead.aggregate([
      { $group: { _id: '$service', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);
    
    const stats = {
      success: true,
      stats: {
        total,
        new: newCount,
        contacted: contactedCount,
        qualified: qualifiedCount,
        converted: convertedCount,
        lost: lostCount,
        today: todayCount,
        thisWeek: weekCount,
        thisMonth: monthCount,
        conversionRate: parseFloat(conversionRate),
        topSources,
        topServices
      }
    };
    
    // Cache for 5 minutes
    if (req.app.locals.redis) {
      await req.app.locals.redis.set(
        'cache:leads:stats',
        JSON.stringify(stats),
        'EX',
        300
      );
    }
    
    res.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics'
    });
  }
});

// Delete lead (admin only)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    
    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }
    
    // Clear cache
    if (req.app.locals.redis) {
      await req.app.locals.redis.del('cache:leads:stats');
    }
    
    res.json({
      success: true,
      message: 'Lead deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting lead:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete lead'
    });
  }
});

// Bulk delete leads (admin only)
router.post('/bulk-delete', authMiddleware, async (req, res) => {
  try {
    const { leadIds } = req.body;
    
    if (!Array.isArray(leadIds) || leadIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide lead IDs to delete'
      });
    }
    
    const result = await Lead.deleteMany({
      _id: { $in: leadIds }
    });
    
    // Clear cache
    if (req.app.locals.redis) {
      await req.app.locals.redis.del('cache:leads:stats');
    }
    
    res.json({
      success: true,
      message: `Deleted ${result.deletedCount} leads`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Bulk delete error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete leads'
    });
  }
});

// Export leads to CSV (admin only)
router.get('/export/csv', authMiddleware, async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    
    // Create CSV content
    const csvHeaders = 'Name,Email,Company,Phone,Service,Budget,Status,Score,Source,IP Address,Location,Device,Created At\n';
    const csvRows = leads.map(lead => 
      `"${lead.name}","${lead.email}","${lead.company || ''}","${lead.phone || ''}","${lead.service}","${lead.budget || ''}","${lead.status}","${lead.score}","${lead.source}","${lead.ipAddress || ''}","${lead.location?.city || ''} ${lead.location?.country || ''}","${lead.device?.deviceType || ''}","${lead.createdAt.toISOString()}"`
    ).join('\n');
    
    const csv = csvHeaders + csvRows;
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=leads-${Date.now()}.csv`);
    res.send(csv);
  } catch (error) {
    console.error('Error exporting leads:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export leads'
    });
  }
});

// Export leads to Excel (admin only) - GET all leads
router.get('/export/excel', authMiddleware, async (req, res) => {
  try {
    const ExcelJS = require('exceljs');
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Click2Leads';
    workbook.created = new Date();
    
    const sheet = workbook.addWorksheet('Leads');
    
    // Define columns
    sheet.columns = [
      { header: 'ID', key: '_id', width: 25 },
      { header: 'Name', key: 'name', width: 25 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Company', key: 'company', width: 25 },
      { header: 'Phone', key: 'phone', width: 20 },
      { header: 'Service', key: 'service', width: 25 },
      { header: 'Budget', key: 'budget', width: 20 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Score', key: 'score', width: 10 },
      { header: 'Source', key: 'source', width: 20 },
      { header: 'IP Address', key: 'ipAddress', width: 20 },
      { header: 'Country', key: 'country', width: 15 },
      { header: 'City', key: 'city', width: 15 },
      { header: 'Device', key: 'device', width: 15 },
      { header: 'Created At', key: 'createdAt', width: 20 },
      { header: 'Message', key: 'message', width: 50 }
    ];
    
    // Get leads
    const leads = await Lead.find().sort({ createdAt: -1 });
    
    // Add rows
    leads.forEach(lead => {
      sheet.addRow({
        _id: lead._id.toString(),
        name: lead.name,
        email: lead.email,
        company: lead.company || '',
        phone: lead.phone || '',
        service: lead.service,
        budget: lead.budget || '',
        status: lead.status,
        score: lead.score,
        source: lead.source,
        ipAddress: lead.ipAddress || '',
        country: lead.location?.country || '',
        city: lead.location?.city || '',
        device: lead.device?.deviceType || '',
        createdAt: lead.createdAt ? new Date(lead.createdAt).toLocaleString() : '',
        message: lead.message || ''
      });
    });
    
    // Style the header row
    sheet.getRow(1).font = { bold: true };
    sheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4A90E2' }
    };
    
    // Set response headers
    const filename = `leads-${new Date().toISOString().split('T')[0]}.xlsx`;
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
    // Write to response
    await workbook.xlsx.write(res);
    res.end();
    
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export leads to Excel'
    });
  }
});

// Export selected leads to Excel (admin only) - POST with lead IDs
router.post('/export/excel', authMiddleware, async (req, res) => {
  try {
    const { leadIds } = req.body;
    const ExcelJS = require('exceljs');
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Click2Leads';
    workbook.created = new Date();
    
    const sheet = workbook.addWorksheet('Leads');
    
    // Define columns
    sheet.columns = [
      { header: 'ID', key: '_id', width: 25 },
      { header: 'Name', key: 'name', width: 25 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Company', key: 'company', width: 25 },
      { header: 'Phone', key: 'phone', width: 20 },
      { header: 'Service', key: 'service', width: 25 },
      { header: 'Budget', key: 'budget', width: 20 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Score', key: 'score', width: 10 },
      { header: 'Source', key: 'source', width: 20 },
      { header: 'IP Address', key: 'ipAddress', width: 20 },
      { header: 'Country', key: 'country', width: 15 },
      { header: 'City', key: 'city', width: 15 },
      { header: 'Device', key: 'device', width: 15 },
      { header: 'Created At', key: 'createdAt', width: 20 },
      { header: 'Message', key: 'message', width: 50 }
    ];
    
    // Get leads - either selected ones or all
    let leads;
    if (leadIds && Array.isArray(leadIds) && leadIds.length > 0) {
      leads = await Lead.find({ _id: { $in: leadIds } }).sort({ createdAt: -1 });
    } else {
      leads = await Lead.find().sort({ createdAt: -1 });
    }
    
    // Add rows
    leads.forEach(lead => {
      sheet.addRow({
        _id: lead._id.toString(),
        name: lead.name,
        email: lead.email,
        company: lead.company || '',
        phone: lead.phone || '',
        service: lead.service,
        budget: lead.budget || '',
        status: lead.status,
        score: lead.score,
        source: lead.source,
        ipAddress: lead.ipAddress || '',
        country: lead.location?.country || '',
        city: lead.location?.city || '',
        device: lead.device?.deviceType || '',
        createdAt: lead.createdAt ? new Date(lead.createdAt).toLocaleString() : '',
        message: lead.message || ''
      });
    });
    
    // Style the header row
    sheet.getRow(1).font = { bold: true };
    sheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4A90E2' }
    };
    
    // Set response headers
    const filename = `leads-${new Date().toISOString().split('T')[0]}.xlsx`;
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
    // Write to response
    await workbook.xlsx.write(res);
    res.end();
    
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export leads to Excel'
    });
  }
});

module.exports = router;