const express = require('express');
const router = express.Router();

const services = [
  {
    id: 1,
    name: 'Google Ads Management',
    description: 'Maximize ROI with expertly managed Google Ads campaigns',
    features: ['Keyword Research', 'Ad Copy Optimization', 'Bid Management', 'Conversion Tracking'],
    price: { monthly: 999, setup: 500 }
  },
  {
    id: 2,
    name: 'Facebook & Instagram Ads',
    description: 'Engage your audience with compelling social media campaigns',
    features: ['Audience Targeting', 'Creative Design', 'A/B Testing', 'Retargeting'],
    price: { monthly: 799, setup: 300 }
  },
  {
    id: 3,
    name: 'Native & Programmatic',
    description: 'Reach your audience through premium native networks',
    features: ['Taboola', 'Outbrain', 'DSP Management', 'Real-time Bidding'],
    price: { monthly: 1499, setup: 750 }
  },
  {
    id: 4,
    name: 'Web Development',
    description: 'Custom websites and landing pages built for conversion',
    features: ['React/Next.js', 'Node.js', 'E-commerce', 'CMS Integration'],
    price: { project: 5000 }
  },
  {
    id: 5,
    name: 'Hosting & Infrastructure',
    description: 'Reliable, fast, and secure hosting solutions',
    features: ['Cloud Hosting', 'SSL Certificates', 'CDN Setup', '99.9% Uptime'],
    price: { monthly: 199, setup: 99 }
  },
  {
    id: 6,
    name: 'Analytics & Tracking',
    description: 'Data-driven insights to optimize your marketing',
    features: ['GA4 Setup', 'Conversion Tracking', 'Custom Dashboards', 'ROI Analysis'],
    price: { monthly: 499, setup: 299 }
  }
];

router.get('/', async (req, res) => {
  try {
    res.json({
      success: true,
      services: services
    });
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch services'
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const service = services.find(s => s.id === parseInt(req.params.id));
    
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }
    
    res.json({
      success: true,
      service: service
    });
  } catch (error) {
    console.error('Error fetching service:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch service'
    });
  }
});

module.exports = router;