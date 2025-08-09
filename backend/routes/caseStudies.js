const express = require('express');
const router = express.Router();

const caseStudies = [
  {
    id: 1,
    client: 'E-Commerce Fashion Brand',
    industry: 'Fashion & Retail',
    challenge: 'Low conversion rates and high CAC on Google Ads',
    solution: 'Implemented Smart Shopping campaigns with dynamic remarketing',
    results: {
      roi: '450%',
      leads: '2,500+',
      conversion: '3.8%',
      revenue: '£285,000'
    },
    testimonial: 'Click2Leads transformed our digital marketing. Our ROAS increased by 450% in just 3 months!',
    duration: '3 months',
    services: ['Google Ads', 'Landing Pages', 'Analytics']
  },
  {
    id: 2,
    client: 'SaaS Startup',
    industry: 'Technology',
    challenge: 'Struggling to generate qualified B2B leads',
    solution: 'LinkedIn Ads + Google Ads strategy with landing page optimization',
    results: {
      roi: '380%',
      leads: '850+',
      conversion: '5.2%',
      revenue: '£420,000'
    },
    testimonial: 'The quality of leads we receive now is exceptional!',
    duration: '6 months',
    services: ['LinkedIn Ads', 'Google Ads', 'Web Development']
  }
];

router.get('/', async (req, res) => {
  try {
    res.json({
      success: true,
      caseStudies: caseStudies
    });
  } catch (error) {
    console.error('Error fetching case studies:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch case studies'
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const study = caseStudies.find(s => s.id === parseInt(req.params.id));
    
    if (!study) {
      return res.status(404).json({
        success: false,
        message: 'Case study not found'
      });
    }
    
    res.json({
      success: true,
      caseStudy: study
    });
  } catch (error) {
    console.error('Error fetching case study:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch case study'
    });
  }
});

module.exports = router;