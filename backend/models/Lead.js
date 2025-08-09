const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  phone: {
    type: String,
    // Phone must be exactly 10 or 11 digits (optional + prefix allowed)
    match: [/^[\+]?[0-9]{10,11}$/, 'Phone number must be 10 or 11 digits']
  },
  company: {
    type: String,
    trim: true,
    maxlength: [100, 'Company name cannot be more than 100 characters']
  },
  service: {
    type: String,
    required: [true, 'Please select a service'],
    enum: ['Google Ads', 'Facebook Ads', 'Native Ads', 'Web Development', 'Hosting', 'Analytics', 'Full Package', 'Social Media Marketing', 'Native & Programmatic', 'Analytics & Insights']
  },
  budget: {
    type: String,
    enum: ['Under £1,000', '£1,000 - £5,000', '£5,000 - £10,000', '£10,000 - £25,000', '£25,000+']
  },
  message: {
    type: String,
    maxlength: [1000, 'Message cannot be more than 1000 characters']
  },
  source: {
    type: String,
    enum: ['Website Form', 'Google Ads', 'Facebook', 'LinkedIn', 'Referral', 'Direct Contact', 'Other', 'Email', 'Instagram'],
    default: 'Website Form'
  },
  status: {
    type: String,
    enum: ['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'converted', 'lost'],
    default: 'new'
  },
  value: {
    type: Number,
    default: 0
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  // Enhanced tracking fields
  ipAddress: String,
  location: {
    country: String,
    city: String,
    region: String,
    timezone: String
  },
  device: {
    deviceType: String,
    os: String,
    browser: String
  },
  visitorId: {
    type: String,
    index: true
  },
  userAgent: String,
  referrer: String,
  utmSource: String,
  utmMedium: String,
  utmCampaign: String,
  utmTerm: String,
  utmContent: String,
  notes: [{
    text: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  activities: [{
    type: {
      type: String,
      enum: ['call', 'email', 'meeting', 'proposal', 'follow-up', 'note']
    },
    description: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  gdprConsent: {
    type: Boolean,
    default: false
  },
  marketingConsent: {
    type: Boolean,
    default: false
  },
  nextFollowUp: Date,
  convertedAt: Date,
  lostReason: String,
  tags: [String],
  score: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for search
leadSchema.index({ 
  name: 'text', 
  email: 'text', 
  company: 'text',
  message: 'text' 
});

// Index for performance
leadSchema.index({ status: 1, createdAt: -1 });
leadSchema.index({ assignedTo: 1, status: 1 });
leadSchema.index({ email: 1 });
leadSchema.index({ createdAt: -1 });

// Calculate lead score
leadSchema.methods.calculateScore = function() {
  let score = 0;
  
  // Budget scoring
  const budgetScores = {
    'Under £1,000': 10,
    '£1,000 - £5,000': 25,
    '£5,000 - £10,000': 40,
    '£10,000 - £25,000': 60,
    '£25,000+': 80
  };
  score += budgetScores[this.budget] || 0;
  
  // Service scoring
  if (this.service === 'Full Package') score += 20;
  else if (['Google Ads', 'Facebook Ads'].includes(this.service)) score += 15;
  else score += 10;
  
  // Activity scoring
  if (this.activities.length > 5) score += 10;
  else if (this.activities.length > 2) score += 5;
  
  // Cap at 100
  this.score = Math.min(score, 100);
  return this.score;
};

// Auto-update score on save
leadSchema.pre('save', function(next) {
  this.calculateScore();
  next();
});

module.exports = mongoose.model('Lead', leadSchema);