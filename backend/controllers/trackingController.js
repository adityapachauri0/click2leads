const Visitor = require('../models/Visitor');
const getClientIp = require('../utils/getClientIp');
const crypto = require('crypto');

// Generate unique visitor ID
const generateVisitorId = () => {
  return `visitor_${Date.now()}_${crypto.randomBytes(8).toString('hex')}`;
};

// Track visitor
exports.trackVisitor = async (req, res) => {
  try {
    const {
      fingerprint,
      visitorId,
      sessionId,
      referrer,
      page,
      device,
      screenResolution,
      language,
      platform
    } = req.body;

    const ipAddress = getClientIp(req);
    const userAgent = req.headers['user-agent'];

    // Find or create visitor
    let visitor = await Visitor.findOne({
      $or: [
        { visitorId: visitorId },
        { fingerprint: fingerprint }
      ]
    });

    if (!visitor) {
      // Create new visitor
      visitor = new Visitor({
        visitorId: visitorId || generateVisitorId(),
        fingerprint: fingerprint || crypto.randomBytes(16).toString('hex'),
        ipAddress,
        device: {
          type: device?.type || 'desktop',
          os: device?.os || 'unknown',
          browser: device?.browser || 'unknown',
          screenResolution: screenResolution || 'unknown',
          language: language || 'en',
          platform: platform || 'unknown'
        },
        firstVisit: new Date(),
        lastVisit: new Date()
      });
    } else {
      // Update existing visitor
      visitor.lastVisit = new Date();
      visitor.totalVisits = (visitor.totalVisits || 0) + 1;
      visitor.ipAddress = ipAddress; // Update IP in case it changed
    }

    // Add session if new
    const existingSession = visitor.sessions.find(s => s.sessionId === sessionId);
    if (!existingSession && sessionId) {
      visitor.sessions.push({
        sessionId,
        startTime: new Date(),
        pageViews: 1,
        events: 0,
        referrer: referrer || {},
        bounced: false
      });
    }

    // Track page visit
    if (page) {
      const pageIndex = visitor.pagesVisited.findIndex(p => p.url === page.url);
      if (pageIndex >= 0) {
        visitor.pagesVisited[pageIndex].visits++;
        visitor.pagesVisited[pageIndex].lastVisited = new Date();
      } else {
        visitor.pagesVisited.push({
          url: page.url,
          title: page.title || 'Untitled',
          visits: 1,
          totalTimeSpent: 0,
          clicks: 0,
          lastVisited: new Date()
        });
      }
      visitor.behavior.totalPageViews++;
    }

    // Update engagement scores
    visitor.updateEngagement();
    visitor.calculateLeadScore();

    await visitor.save();

    res.json({
      success: true,
      visitorId: visitor.visitorId,
      sessionId
    });

  } catch (error) {
    console.error('Visitor tracking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to track visitor'
    });
  }
};

// Track events
exports.trackEvent = async (req, res) => {
  try {
    const { visitorId, category, action, label, value } = req.body;

    const visitor = await Visitor.findOne({ visitorId });
    if (!visitor) {
      return res.status(404).json({
        success: false,
        message: 'Visitor not found'
      });
    }

    // Add event
    visitor.events.push({
      category,
      action,
      label,
      value,
      timestamp: new Date()
    });

    // Update behavior based on events
    if (category === 'form' && action === 'start') {
      if (!visitor.behavior.interests.includes('form-interaction')) {
        visitor.behavior.interests.push('form-interaction');
      }
    }

    await visitor.save();

    res.json({ success: true });

  } catch (error) {
    console.error('Event tracking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to track event'
    });
  }
};

// Identify visitor with contact info
exports.identifyVisitor = async (req, res) => {
  try {
    const { visitorId, email, name, phone, firstName, lastName } = req.body;

    const visitor = await Visitor.findOne({ visitorId });
    if (!visitor) {
      return res.status(404).json({
        success: false,
        message: 'Visitor not found'
      });
    }

    // Update visitor identification
    if (email) visitor.email = email;
    if (name) visitor.name = name;
    if (firstName) visitor.firstName = firstName;
    if (lastName) visitor.lastName = lastName;
    if (phone) visitor.phone = phone;

    // Update status
    if (visitor.status === 'anonymous' && (email || phone)) {
      visitor.status = 'identified';
    }

    // Recalculate lead score with new info
    visitor.calculateLeadScore();

    await visitor.save();

    res.json({ success: true });

  } catch (error) {
    console.error('Visitor identification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to identify visitor'
    });
  }
};

// Capture form field data
exports.captureFieldData = async (req, res) => {
  try {
    const { visitorId, formId, fieldName, fieldValue } = req.body;

    const visitor = await Visitor.findOne({ visitorId });
    if (!visitor) {
      return res.status(404).json({
        success: false,
        message: 'Visitor not found'
      });
    }

    // Find or create form interaction
    let formInteraction = visitor.formInteractions.find(f => f.formId === formId);
    if (!formInteraction) {
      formInteraction = {
        formId,
        fields: [],
        abandoned: false,
        timestamp: new Date()
      };
      visitor.formInteractions.push(formInteraction);
    }

    // Update field data
    const fieldIndex = formInteraction.fields.findIndex(f => f.name === fieldName);
    if (fieldIndex >= 0) {
      formInteraction.fields[fieldIndex].lastValue = fieldValue;
      formInteraction.fields[fieldIndex].lastUpdated = new Date();
      formInteraction.fields[fieldIndex].interacted = true;
    } else {
      formInteraction.fields.push({
        name: fieldName,
        interacted: true,
        completed: fieldValue && fieldValue.length > 0,
        lastValue: fieldValue,
        lastUpdated: new Date()
      });
    }

    // Auto-identify if capturing email or phone
    if (fieldName === 'email' && fieldValue) {
      visitor.email = fieldValue;
      if (visitor.status === 'anonymous') {
        visitor.status = 'identified';
      }
    }
    if (fieldName === 'phone' && fieldValue) {
      visitor.phone = fieldValue;
      if (visitor.status === 'anonymous') {
        visitor.status = 'identified';
      }
    }
    if (fieldName === 'name' && fieldValue) {
      visitor.name = fieldValue;
    }

    // Mark as prospect if they're filling forms
    if (visitor.status === 'identified' && formInteraction.fields.length > 2) {
      visitor.status = 'prospect';
    }

    await visitor.save();

    res.json({ success: true });

  } catch (error) {
    console.error('Field capture error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to capture field data'
    });
  }
};

// Get visitor analytics for admin
exports.getVisitorAnalytics = async (req, res) => {
  try {
    const totalVisitors = await Visitor.countDocuments();
    const identifiedVisitors = await Visitor.countDocuments({ status: { $ne: 'anonymous' } });
    const prospects = await Visitor.countDocuments({ status: 'prospect' });
    const leads = await Visitor.countDocuments({ status: 'lead' });

    // Get top pages
    const topPages = await Visitor.aggregate([
      { $unwind: '$pagesVisited' },
      {
        $group: {
          _id: '$pagesVisited.url',
          visits: { $sum: '$pagesVisited.visits' },
          uniqueVisitors: { $addToSet: '$_id' }
        }
      },
      {
        $project: {
          url: '$_id',
          visits: 1,
          uniqueVisitors: { $size: '$uniqueVisitors' }
        }
      },
      { $sort: { visits: -1 } },
      { $limit: 10 }
    ]);

    // Get engagement distribution
    const engagementRanges = await Visitor.aggregate([
      {
        $bucket: {
          groupBy: '$behavior.engagementScore',
          boundaries: [0, 25, 50, 75, 100],
          default: 'Unknown',
          output: {
            count: { $sum: 1 }
          }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        summary: {
          totalVisitors,
          identifiedVisitors,
          prospects,
          leads,
          conversionRate: totalVisitors > 0 ? ((leads / totalVisitors) * 100).toFixed(2) : 0
        },
        topPages,
        engagementRanges
      }
    });

  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get analytics'
    });
  }
};

// Get visitor details
exports.getVisitorDetails = async (req, res) => {
  try {
    const { visitorId } = req.params;
    
    const visitor = await Visitor.findOne({ visitorId });
    if (!visitor) {
      return res.status(404).json({
        success: false,
        message: 'Visitor not found'
      });
    }

    res.json({
      success: true,
      data: visitor
    });

  } catch (error) {
    console.error('Get visitor error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get visitor details'
    });
  }
};

// Export visitors data
exports.exportVisitors = async (req, res) => {
  try {
    const ExcelJS = require('exceljs');
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Visitors');

    // Define columns
    sheet.columns = [
      { header: 'Visitor ID', key: 'visitorId', width: 20 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Name', key: 'name', width: 25 },
      { header: 'Phone', key: 'phone', width: 20 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Lead Score', key: 'leadScore', width: 15 },
      { header: 'Engagement Score', key: 'engagementScore', width: 15 },
      { header: 'Total Visits', key: 'totalVisits', width: 15 },
      { header: 'Total Page Views', key: 'totalPageViews', width: 15 },
      { header: 'IP Address', key: 'ipAddress', width: 20 },
      { header: 'First Visit', key: 'firstVisit', width: 20 },
      { header: 'Last Visit', key: 'lastVisit', width: 20 }
    ];

    // Get visitors
    const visitors = await Visitor.find()
      .sort({ createdAt: -1 })
      .limit(1000);

    // Add rows
    visitors.forEach(visitor => {
      sheet.addRow({
        visitorId: visitor.visitorId,
        email: visitor.email || '',
        name: visitor.name || '',
        phone: visitor.phone || '',
        status: visitor.status,
        leadScore: visitor.behavior.leadScore,
        engagementScore: visitor.behavior.engagementScore,
        totalVisits: visitor.totalVisits,
        totalPageViews: visitor.behavior.totalPageViews,
        ipAddress: visitor.ipAddress,
        firstVisit: visitor.firstVisit ? new Date(visitor.firstVisit).toLocaleString() : '',
        lastVisit: visitor.lastVisit ? new Date(visitor.lastVisit).toLocaleString() : ''
      });
    });

    // Style header
    sheet.getRow(1).font = { bold: true };
    sheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4A90E2' }
    };

    // Set response headers
    const filename = `visitors-${new Date().toISOString().split('T')[0]}.xlsx`;
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    // Write to response
    await workbook.xlsx.write(res);
    res.end();

  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export visitors'
    });
  }
};

// Bulk delete visitors
exports.bulkDeleteVisitors = async (req, res) => {
  try {
    const { visitorIds } = req.body;

    if (!Array.isArray(visitorIds) || visitorIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide visitor IDs to delete'
      });
    }

    const result = await Visitor.deleteMany({
      visitorId: { $in: visitorIds }
    });

    res.json({
      success: true,
      message: `Deleted ${result.deletedCount} visitors`
    });

  } catch (error) {
    console.error('Bulk delete error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete visitors'
    });
  }
};

// Get captured form data for display
exports.getCapturedFormData = async (req, res) => {
  try {
    const visitors = await Visitor.find({
      'formInteractions.0': { $exists: true }
    })
      .select('visitorId email name phone formInteractions status behavior.leadScore createdAt')
      .sort({ createdAt: -1 })
      .limit(100);

    const formData = visitors.map(visitor => {
      const latestForm = visitor.formInteractions[visitor.formInteractions.length - 1];
      const fields = {};
      
      if (latestForm && latestForm.fields) {
        latestForm.fields.forEach(field => {
          fields[field.name] = field.lastValue;
        });
      }

      return {
        visitorId: visitor.visitorId,
        email: visitor.email || fields.email || '',
        name: visitor.name || fields.name || '',
        phone: visitor.phone || fields.phone || '',
        status: visitor.status,
        leadScore: visitor.behavior?.leadScore || 0,
        formData: fields,
        capturedAt: latestForm?.timestamp || visitor.createdAt
      };
    });

    res.json({
      success: true,
      data: formData
    });

  } catch (error) {
    console.error('Get captured data error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get captured form data'
    });
  }
};