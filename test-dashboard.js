#!/usr/bin/env node

const axios = require('axios');

const API_URL = 'http://localhost:5001/api';

async function testDashboard() {
  console.log('🧪 Testing Dashboard Data Flow\n');
  
  try {
    // Step 1: Login
    console.log('1️⃣ Testing Login...');
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      email: 'admin@click2leads.co.uk',
      password: 'admin123'
    });
    
    const { token, user } = loginResponse.data;
    console.log('✅ Login successful!');
    console.log(`   User: ${user.name} (${user.role})`);
    console.log(`   Token: ${token.substring(0, 20)}...`);
    
    // Step 2: Fetch Dashboard Metrics
    console.log('\n2️⃣ Testing Dashboard Metrics...');
    const metricsResponse = await axios.get(`${API_URL}/dashboard/metrics`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const metrics = metricsResponse.data;
    console.log('✅ Metrics fetched successfully!');
    console.log('   Total Leads:', metrics.totalLeads);
    console.log('   New Leads:', metrics.newLeads);
    console.log('   Revenue: £', metrics.revenue);
    console.log('   Conversion Rate:', metrics.conversionRate + '%');
    console.log('   Active Clients:', metrics.activeClients);
    
    // Step 3: Fetch Dashboard Charts
    console.log('\n3️⃣ Testing Dashboard Charts...');
    const dashboardResponse = await axios.get(`${API_URL}/dashboard`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const dashboard = dashboardResponse.data;
    console.log('✅ Dashboard data fetched successfully!');
    console.log('   Revenue Chart:', dashboard.revenueChart ? '✓' : '✗');
    console.log('   Leads Chart:', dashboard.leadsChart ? '✓' : '✗');
    console.log('   Conversion Chart:', dashboard.conversionChart ? '✓' : '✗');
    console.log('   Recent Leads:', dashboard.recentLeads?.length || 0);
    console.log('   Top Campaigns:', dashboard.topCampaigns?.length || 0);
    
    // Step 4: Fetch Leads
    console.log('\n4️⃣ Testing Leads API...');
    const leadsResponse = await axios.get(`${API_URL}/leads`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('✅ Leads fetched successfully!');
    console.log('   Total Leads:', leadsResponse.data.total || leadsResponse.data.leads?.length || 0);
    
    console.log('\n🎉 All API endpoints are working correctly!');
    console.log('📊 Dashboard should display real data from the API.');
    
  } catch (error) {
    console.error('\n❌ Error:', error.response?.data?.message || error.message);
    console.error('   Status:', error.response?.status);
    console.error('   URL:', error.config?.url);
  }
}

testDashboard();