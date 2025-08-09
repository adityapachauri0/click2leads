const express = require('express');
const router = express.Router();

router.get('/dashboard', async (req, res) => {
  try {
    // Mock analytics data
    const analyticsData = {
      performance: [
        { month: 'Jan', leads: 450, conversions: 120, revenue: 45000 },
        { month: 'Feb', leads: 520, conversions: 145, revenue: 52000 },
        { month: 'Mar', leads: 680, conversions: 190, revenue: 68000 },
        { month: 'Apr', leads: 750, conversions: 220, revenue: 78000 },
        { month: 'May', leads: 890, conversions: 280, revenue: 92000 },
        { month: 'Jun', leads: 1020, conversions: 350, revenue: 115000 },
      ],
      channels: [
        { name: 'Google Ads', value: 35 },
        { name: 'Facebook', value: 28 },
        { name: 'Native', value: 20 },
        { name: 'Organic', value: 17 },
      ],
      metrics: {
        avgCPC: 2.45,
        ctr: 4.8,
        conversionRate: 3.2,
        roas: 4.5
      }
    };
    
    res.json({
      success: true,
      data: analyticsData
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics'
    });
  }
});

module.exports = router;