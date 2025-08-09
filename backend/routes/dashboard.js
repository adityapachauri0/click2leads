const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');

// Get dashboard metrics
router.get('/metrics', authMiddleware, (req, res) => {
  const metrics = {
    totalLeads: 1247,
    newLeads: 89,
    conversionRate: 23.5,
    revenue: 125000,
    activeClients: 45,
    campaignsRunning: 12,
    averageROI: 3.2,
    monthlyGrowth: 15.7
  };
  
  res.json(metrics);
});

// Get chart data
router.get('/charts/:type', authMiddleware, (req, res) => {
  const { type } = req.params;
  
  const chartData = {
    revenue: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [{
        label: 'Revenue',
        data: [45000, 52000, 48000, 61000, 58000, 67000],
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)'
      }]
    },
    leads: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [{
        label: 'New Leads',
        data: [12, 19, 15, 25, 22, 30, 28],
        borderColor: '#06b6d4',
        backgroundColor: 'rgba(6, 182, 212, 0.1)'
      }]
    },
    conversion: {
      labels: ['Google Ads', 'Facebook', 'LinkedIn', 'Direct'],
      datasets: [{
        label: 'Conversions',
        data: [35, 28, 18, 19],
        backgroundColor: ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b']
      }]
    }
  };
  
  if (chartData[type]) {
    res.json(chartData[type]);
  } else {
    res.status(404).json({ message: 'Chart type not found' });
  }
});

// Get complete dashboard data
router.get('/', authMiddleware, (req, res) => {
  const dashboardData = {
    metrics: {
      totalLeads: 1247,
      newLeads: 89,
      conversionRate: 23.5,
      revenue: 125000,
      activeClients: 45,
      campaignsRunning: 12,
      averageROI: 3.2,
      monthlyGrowth: 15.7
    },
    revenueChart: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [{
        label: 'Revenue',
        data: [45000, 52000, 48000, 61000, 58000, 67000],
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)'
      }]
    },
    leadsChart: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [{
        label: 'New Leads',
        data: [12, 19, 15, 25, 22, 30, 28],
        borderColor: '#06b6d4',
        backgroundColor: 'rgba(6, 182, 212, 0.1)'
      }]
    },
    conversionChart: {
      labels: ['Google Ads', 'Facebook', 'LinkedIn', 'Direct'],
      datasets: [{
        label: 'Conversions',
        data: [35, 28, 18, 19],
        backgroundColor: ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b']
      }]
    },
    recentLeads: [
      {
        id: '1',
        name: 'John Smith',
        company: 'Tech Solutions Ltd',
        value: '£5,000',
        status: 'new',
        date: '2024-01-10'
      },
      {
        id: '2',
        name: 'Sarah Johnson',
        company: 'E-commerce Pro',
        value: '£10,000',
        status: 'contacted',
        date: '2024-01-09'
      }
    ],
    topCampaigns: [
      { name: 'Summer Sale 2024', roi: 4.2, leads: 234 },
      { name: 'Product Launch', roi: 3.8, leads: 189 },
      { name: 'Brand Awareness', roi: 2.9, leads: 156 }
    ]
  };
  
  res.json(dashboardData);
});

module.exports = router;