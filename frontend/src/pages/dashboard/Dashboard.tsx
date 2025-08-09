import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { fetchDashboardData } from '../../store/slices/dashboardSlice';
import { fetchLeads, deleteLead } from '../../store/slices/leadsSlice';
import toast from 'react-hot-toast';
import axios from 'axios';
import Cookies from 'js-cookie';
import { 
  FaUsers, FaChartLine, FaPoundSign, FaEnvelope, 
  FaClock, FaCheckCircle, FaExclamationTriangle, FaDownload,
  FaBell, FaFilter, FaSearch, FaEye, FaEdit, FaTrash,
  FaGoogle, FaFacebookF, FaBullhorn, FaGlobe
} from 'react-icons/fa';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, 
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { format } from 'date-fns';

interface Lead {
  id: number;
  name: string;
  email: string;
  company: string;
  phone: string;
  budget: string;
  message: string;
  source: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  createdAt: Date;
  value: number;
}

interface Campaign {
  id: number;
  name: string;
  platform: string;
  status: 'active' | 'paused' | 'completed';
  budget: number;
  spent: number;
  clicks: number;
  conversions: number;
  cpc: number;
  roi: number;
}

const Dashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLeads, setSelectedLeads] = useState<number[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Get data from Redux store
  const { metrics, revenueChart, leadsChart, conversionChart, isLoading, error } = useSelector(
    (state: RootState) => state.dashboard
  );
  const { leads: apiLeads } = useSelector((state: RootState) => state.leads);

  // Fetch data on component mount
  useEffect(() => {
    dispatch(fetchDashboardData());
    dispatch(fetchLeads());
  }, [dispatch]);

  // Handle lead deletion
  const handleDeleteLead = async (lead: any) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      try {
        // Use _id for MongoDB or id for mock data
        const idToDelete = lead._id || lead.id;
        await dispatch(deleteLead(idToDelete.toString())).unwrap();
        toast.success('Lead deleted successfully');
        // Refresh leads after deletion
        dispatch(fetchLeads());
      } catch (error: any) {
        console.error('Delete error:', error);
        toast.error(error.message || 'Failed to delete lead');
      }
    }
  };

  // Handle bulk delete
  const handleBulkDelete = async () => {
    const selectedCount = selectedLeads.length;
    if (window.confirm(`Are you sure you want to delete ${selectedCount} selected lead${selectedCount > 1 ? 's' : ''}?`)) {
      try {
        // Get the actual MongoDB IDs of selected leads
        const leadsToDelete = leads.filter(lead => selectedLeads.includes(lead.id));
        const idsToDelete = leadsToDelete.map(lead => lead._id || lead.id);
        
        // Call bulk delete endpoint
        const response = await axios.post('http://localhost:5003/api/leads/bulk-delete', {
          leadIds: idsToDelete
        });
        
        if (response.data.success) {
          toast.success(`Successfully deleted ${response.data.deletedCount} lead${response.data.deletedCount > 1 ? 's' : ''}`);
          
          // Clear selection
          setSelectedLeads([]);
          
          // Refresh leads
          dispatch(fetchLeads());
        } else {
          toast.error('Failed to delete leads');
        }
      } catch (error: any) {
        console.error('Bulk delete error:', error);
        toast.error(error.response?.data?.message || 'Failed to delete leads');
      }
    }
  };

  // Handle bulk export to Excel
  const handleBulkExport = async () => {
    try {
      const selectedCount = selectedLeads.length;
      
      if (selectedCount === 0) {
        toast.error('Please select leads to export');
        return;
      }
      
      // Get the selected leads data
      const leadsToExport = leads.filter(lead => selectedLeads.includes(lead.id));
      const idsToExport = leadsToExport.map(lead => lead._id || lead.id);
      
      // Call the export endpoint with selected lead IDs (temporarily remove auth for testing)
      const response = await axios.post('http://localhost:5003/api/leads/export/excel', 
        { leadIds: idsToExport },
        {
          responseType: 'blob',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Create a download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `leads-export-${new Date().toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success(`Successfully exported ${selectedCount} lead${selectedCount > 1 ? 's' : ''}`);
    } catch (error: any) {
      console.error('Export error:', error);
      toast.error('Failed to export leads');
    }
  };

  // Show error if any
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // Use API data or fallback to mock data
  const mockLeads: Lead[] = [
    {
      id: 1,
      name: 'John Smith',
      email: 'john@techcorp.com',
      company: 'TechCorp Ltd',
      phone: '+44 20 1234 5678',
      budget: '£5,000 - £10,000',
      message: 'Looking for Google Ads management',
      source: 'Google Ads',
      status: 'new',
      createdAt: new Date('2024-01-15'),
      value: 7500
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah@ecomstore.com',
      company: 'Ecom Store',
      phone: '+44 20 9876 5432',
      budget: '£10,000 - £25,000',
      message: 'Need Facebook Ads for product launch',
      source: 'Facebook',
      status: 'contacted',
      createdAt: new Date('2024-01-14'),
      value: 15000
    },
    {
      id: 3,
      name: 'Michael Brown',
      email: 'michael@startup.io',
      company: 'Startup.io',
      phone: '+44 20 5555 1234',
      budget: '£1,000 - £5,000',
      message: 'Website development and SEO',
      source: 'Organic',
      status: 'qualified',
      createdAt: new Date('2024-01-13'),
      value: 3000
    },
    {
      id: 4,
      name: 'Emma Wilson',
      email: 'emma@fashion.com',
      company: 'Fashion Brand',
      phone: '+44 20 7777 8888',
      budget: '> £25,000',
      message: 'Complete digital marketing strategy',
      source: 'Referral',
      status: 'converted',
      createdAt: new Date('2024-01-12'),
      value: 35000
    }
  ];

  // Use real leads from API if available, otherwise use mock data
  const leads = apiLeads.length > 0 ? apiLeads.map((lead: any) => ({
    ...lead,
    _id: lead._id, // Keep the original MongoDB _id
    id: lead._id || lead.id, // Use MongoDB _id as id for display
    createdAt: new Date(lead.createdAt),
    value: lead.value || 0
  })) : mockLeads;

  const [campaigns] = useState<Campaign[]>([
    {
      id: 1,
      name: 'Summer Sale Campaign',
      platform: 'Google Ads',
      status: 'active',
      budget: 10000,
      spent: 6543,
      clicks: 5234,
      conversions: 234,
      cpc: 1.25,
      roi: 4.2
    },
    {
      id: 2,
      name: 'Brand Awareness',
      platform: 'Facebook',
      status: 'active',
      budget: 5000,
      spent: 3210,
      clicks: 8765,
      conversions: 145,
      cpc: 0.37,
      roi: 3.8
    },
    {
      id: 3,
      name: 'Product Launch',
      platform: 'Native',
      status: 'paused',
      budget: 8000,
      spent: 4567,
      clicks: 3456,
      conversions: 89,
      cpc: 1.32,
      roi: 2.9
    }
  ]);

  // Performance data
  // Use API chart data if available
  const performanceData = leadsChart?.datasets?.[0]?.data ? 
    leadsChart.labels.map((label: string, index: number) => ({
      date: label,
      leads: leadsChart.datasets[0].data[index],
      revenue: revenueChart?.datasets?.[0]?.data?.[index] || 0,
      conversions: Math.floor(leadsChart.datasets[0].data[index] * 0.75)
    })) : [
    { date: 'Mon', leads: 12, revenue: 4500, conversions: 8 },
    { date: 'Tue', leads: 15, revenue: 5200, conversions: 10 },
    { date: 'Wed', leads: 18, revenue: 6800, conversions: 14 },
    { date: 'Thu', leads: 22, revenue: 8200, conversions: 17 },
    { date: 'Fri', leads: 28, revenue: 9500, conversions: 22 },
    { date: 'Sat', leads: 20, revenue: 7200, conversions: 15 },
    { date: 'Sun', leads: 16, revenue: 5800, conversions: 12 }
  ];

  // Channel distribution - use API data if available
  const channelData = conversionChart?.datasets?.[0]?.data ? 
    conversionChart.labels.map((label: string, index: number) => ({
      name: label,
      value: conversionChart.datasets[0].data[index],
      color: conversionChart.datasets[0].backgroundColor?.[index] || '#8B5CF6'
    })) : [
    { name: 'Google Ads', value: 35, color: '#0EA5E9' },
    { name: 'Facebook', value: 28, color: '#8B5CF6' },
    { name: 'Native', value: 20, color: '#EC4899' },
    { name: 'Organic', value: 12, color: '#10B981' },
    { name: 'Direct', value: 5, color: '#F59E0B' }
  ];

  // Stats cards data
  // Use API metrics if available, otherwise use calculated values
  const stats = metrics ? {
    totalLeads: metrics.totalLeads,
    newLeads: metrics.newLeads,
    conversionRate: metrics.conversionRate,
    totalRevenue: metrics.revenue,
    activeClients: metrics.activeClients,
    avgDealSize: metrics.revenue / (metrics.totalLeads || 1),
    campaignROI: metrics.averageROI,
    monthlyGrowth: metrics.monthlyGrowth
  } : {
    totalLeads: leads.length,
    newLeads: leads.filter(l => l.status === 'new').length,
    conversionRate: 24.5,
    totalRevenue: leads.reduce((sum, lead) => sum + lead.value, 0),
    activeClients: 47,
    avgDealSize: 12500,
    campaignROI: 4.2,
    monthlyGrowth: 23.5
  };

  const notifications = [
    { id: 1, type: 'success', message: 'New lead from Google Ads campaign', time: '5 min ago' },
    { id: 2, type: 'warning', message: 'Campaign budget 80% consumed', time: '1 hour ago' },
    { id: 3, type: 'info', message: 'Weekly report ready for download', time: '2 hours ago' },
    { id: 4, type: 'success', message: 'Lead converted to customer', time: '3 hours ago' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-500';
      case 'contacted': return 'bg-yellow-500';
      case 'qualified': return 'bg-purple-500';
      case 'converted': return 'bg-green-500';
      case 'lost': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const filteredLeads = leads.filter(lead => 
    lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pt-20">
      {/* Dashboard Header */}
      <div className="bg-black/30 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white">Dashboard</h1>
              <p className="text-gray-400">Welcome back! Here's your business overview</p>
            </div>
            <div className="flex items-center space-x-4">
              {/* Period Selector */}
              <select 
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="bg-white/10 border border-white/20 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-primary-500"
              >
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
              </select>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 text-white hover:text-primary-400 transition-colors"
                >
                  <FaBell className="text-xl" />
                  <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 mt-2 w-80 glass rounded-xl p-4 z-50"
                  >
                    <h3 className="text-white font-semibold mb-3">Notifications</h3>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {notifications.map(notif => (
                        <div key={notif.id} className="flex items-start space-x-2 p-2 hover:bg-white/5 rounded">
                          <div className={`w-2 h-2 rounded-full mt-2 ${
                            notif.type === 'success' ? 'bg-green-500' :
                            notif.type === 'warning' ? 'bg-yellow-500' :
                            'bg-blue-500'
                          }`}></div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-300">{notif.message}</p>
                            <p className="text-xs text-gray-500">{notif.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Export Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-lg font-semibold"
              >
                <FaDownload />
                <span>Export Report</span>
              </motion.button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-6 mt-6">
            {['overview', 'leads', 'campaigns', 'analytics', 'clients'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-2 capitalize font-semibold transition-colors ${
                  activeTab === tab 
                    ? 'text-primary-400 border-b-2 border-primary-400' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass rounded-xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <FaUsers className="text-3xl text-blue-400" />
                  <span className="text-xs text-green-400 bg-green-400/20 px-2 py-1 rounded">
                    +{stats.monthlyGrowth}%
                  </span>
                </div>
                <p className="text-3xl font-bold text-white mb-1">{stats.totalLeads}</p>
                <p className="text-gray-400">Total Leads</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass rounded-xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <FaPoundSign className="text-3xl text-green-400" />
                  <span className="text-xs text-green-400 bg-green-400/20 px-2 py-1 rounded">
                    +18.2%
                  </span>
                </div>
                <p className="text-3xl font-bold text-white mb-1">
                  £{stats.totalRevenue.toLocaleString()}
                </p>
                <p className="text-gray-400">Total Revenue</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass rounded-xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <FaChartLine className="text-3xl text-purple-400" />
                  <span className="text-xs text-green-400 bg-green-400/20 px-2 py-1 rounded">
                    +5.3%
                  </span>
                </div>
                <p className="text-3xl font-bold text-white mb-1">{stats.conversionRate}%</p>
                <p className="text-gray-400">Conversion Rate</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass rounded-xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <FaCheckCircle className="text-3xl text-accent-400" />
                  <span className="text-xs text-green-400 bg-green-400/20 px-2 py-1 rounded">
                    {stats.campaignROI}x
                  </span>
                </div>
                <p className="text-3xl font-bold text-white mb-1">{stats.activeClients}</p>
                <p className="text-gray-400">Active Clients</p>
              </motion.div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Performance Chart */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass rounded-xl p-6"
              >
                <h3 className="text-xl font-bold text-white mb-4">Weekly Performance</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={performanceData}>
                    <defs>
                      <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="date" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none' }} />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="leads" 
                      stroke="#0EA5E9" 
                      fillOpacity={1} 
                      fill="url(#colorLeads)" 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="conversions" 
                      stroke="#8B5CF6" 
                      fillOpacity={1} 
                      fill="url(#colorRevenue)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </motion.div>

              {/* Channel Distribution */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass rounded-xl p-6"
              >
                <h3 className="text-xl font-bold text-white mb-4">Lead Sources</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={channelData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {channelData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none' }} />
                  </PieChart>
                </ResponsiveContainer>
              </motion.div>
            </div>

            {/* Recent Leads Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-xl p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">Recent Leads</h3>
                <button className="text-primary-400 hover:text-primary-300">
                  View All →
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-3 text-gray-400 font-medium">Name</th>
                      <th className="text-left py-3 text-gray-400 font-medium">Company</th>
                      <th className="text-left py-3 text-gray-400 font-medium">Budget</th>
                      <th className="text-left py-3 text-gray-400 font-medium">Source</th>
                      <th className="text-left py-3 text-gray-400 font-medium">Status</th>
                      <th className="text-left py-3 text-gray-400 font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.slice(0, 5).map(lead => (
                      <tr key={lead.id} className="border-b border-white/5 hover:bg-white/5">
                        <td className="py-3">
                          <div>
                            <p className="text-white font-medium">{lead.name}</p>
                            <p className="text-gray-400 text-sm">{lead.email}</p>
                          </div>
                        </td>
                        <td className="py-3 text-gray-300">{lead.company}</td>
                        <td className="py-3 text-gray-300">{lead.budget}</td>
                        <td className="py-3">
                          <span className="text-gray-300">{lead.source}</span>
                        </td>
                        <td className="py-3">
                          <span className={`px-2 py-1 rounded-full text-xs text-white ${getStatusColor(lead.status)}`}>
                            {lead.status}
                          </span>
                        </td>
                        <td className="py-3 text-gray-400 text-sm">
                          {format(lead.createdAt, 'MMM d, yyyy')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </>
        )}

        {activeTab === 'leads' && (
          <div>
            {/* Search and Filters */}
            <div className="glass rounded-xl p-4 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search leads..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500"
                  />
                </div>
                <select className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-primary-500">
                  <option value="">All Status</option>
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="qualified">Qualified</option>
                  <option value="converted">Converted</option>
                  <option value="lost">Lost</option>
                </select>
                <select className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-primary-500">
                  <option value="">All Sources</option>
                  <option value="google">Google Ads</option>
                  <option value="facebook">Facebook</option>
                  <option value="native">Native</option>
                  <option value="organic">Organic</option>
                </select>
                <button className="px-4 py-2 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600 transition-colors">
                  Add Lead
                </button>
              </div>
            </div>

            {/* Leads Table */}
            <div className="glass rounded-xl overflow-hidden">
              <table className="w-full">
                <thead className="bg-black/20">
                  <tr>
                    <th className="p-4 text-left">
                      <input 
                        type="checkbox" 
                        className="rounded border-gray-600"
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedLeads(filteredLeads.map(l => l.id));
                          } else {
                            setSelectedLeads([]);
                          }
                        }}
                      />
                    </th>
                    <th className="p-4 text-left text-gray-400">Contact</th>
                    <th className="p-4 text-left text-gray-400">Company</th>
                    <th className="p-4 text-left text-gray-400">Budget</th>
                    <th className="p-4 text-left text-gray-400">Source</th>
                    <th className="p-4 text-left text-gray-400">IP Address</th>
                    <th className="p-4 text-left text-gray-400">Status</th>
                    <th className="p-4 text-left text-gray-400">Value</th>
                    <th className="p-4 text-left text-gray-400">Date</th>
                    <th className="p-4 text-left text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.map(lead => (
                    <tr key={lead.id} className="border-t border-white/10 hover:bg-white/5">
                      <td className="p-4">
                        <input 
                          type="checkbox" 
                          className="rounded border-gray-600"
                          checked={selectedLeads.includes(lead.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedLeads([...selectedLeads, lead.id]);
                            } else {
                              setSelectedLeads(selectedLeads.filter(id => id !== lead.id));
                            }
                          }}
                        />
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="text-white font-medium">{lead.name}</p>
                          <p className="text-gray-400 text-sm">{lead.email}</p>
                          <p className="text-gray-400 text-sm">{lead.phone}</p>
                        </div>
                      </td>
                      <td className="p-4 text-gray-300">{lead.company}</td>
                      <td className="p-4 text-gray-300">{lead.budget}</td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          {lead.source === 'Google Ads' && <FaGoogle className="text-blue-400" />}
                          {lead.source === 'Facebook' && <FaFacebookF className="text-blue-600" />}
                          {lead.source === 'Native' && <FaBullhorn className="text-purple-400" />}
                          {lead.source === 'Organic' && <FaGlobe className="text-green-400" />}
                          <span className="text-gray-300">{lead.source}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-gray-300 text-sm">
                          <p>{lead.ipAddress || lead._ipAddress || 'N/A'}</p>
                          {lead.location && (
                            <p className="text-xs text-gray-500">
                              {lead.location.city || ''} {lead.location.country || ''}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <select 
                          value={lead.status}
                          className={`px-3 py-1 rounded-full text-xs text-white ${getStatusColor(lead.status)} bg-opacity-100 border-0 cursor-pointer`}
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="qualified">Qualified</option>
                          <option value="converted">Converted</option>
                          <option value="lost">Lost</option>
                        </select>
                      </td>
                      <td className="p-4 text-white font-semibold">
                        £{lead.value.toLocaleString()}
                      </td>
                      <td className="p-4 text-gray-400">
                        {format(lead.createdAt, 'MMM d, yyyy')}
                      </td>
                      <td className="p-4">
                        <div className="flex space-x-2">
                          <button className="text-blue-400 hover:text-blue-300">
                            <FaEye />
                          </button>
                          <button className="text-green-400 hover:text-green-300">
                            <FaEdit />
                          </button>
                          <button 
                            onClick={() => handleDeleteLead(lead)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Bulk Actions */}
            {selectedLeads.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="fixed bottom-8 left-1/2 transform -translate-x-1/2 glass rounded-xl p-4 flex items-center space-x-4"
              >
                <span className="text-white">{selectedLeads.length} selected</span>
                <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                  Send Email
                </button>
                <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
                  Change Status
                </button>
                <button 
                  onClick={handleBulkExport}
                  className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
                >
                  Export
                </button>
                <button 
                  onClick={handleBulkDelete}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Delete
                </button>
              </motion.div>
            )}
          </div>
        )}

        {activeTab === 'campaigns' && (
          <div className="space-y-6">
            {/* Campaign Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {campaigns.map(campaign => (
                <motion.div
                  key={campaign.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass rounded-xl p-6"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-white">{campaign.name}</h3>
                      <p className="text-gray-400">{campaign.platform}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs text-white ${
                      campaign.status === 'active' ? 'bg-green-500' :
                      campaign.status === 'paused' ? 'bg-yellow-500' :
                      'bg-gray-500'
                    }`}>
                      {campaign.status}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Budget Used</span>
                        <span className="text-white">
                          £{campaign.spent.toLocaleString()} / £{campaign.budget.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-primary-500 to-accent-500 h-2 rounded-full"
                          style={{ width: `${(campaign.spent / campaign.budget) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-400 text-sm">Clicks</p>
                        <p className="text-white font-semibold">{campaign.clicks.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Conversions</p>
                        <p className="text-white font-semibold">{campaign.conversions}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">CPC</p>
                        <p className="text-white font-semibold">£{campaign.cpc}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">ROI</p>
                        <p className="text-green-400 font-semibold">{campaign.roi}x</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2 mt-4">
                    <button className="flex-1 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors">
                      View Details
                    </button>
                    <button className="flex-1 py-2 bg-primary-500/20 text-primary-400 rounded-lg hover:bg-primary-500/30 transition-colors">
                      Edit
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Campaign Performance Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-xl p-6"
            >
              <h3 className="text-xl font-bold text-white mb-4">Campaign Performance Comparison</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={campaigns}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none' }} />
                  <Legend />
                  <Bar dataKey="clicks" fill="#0EA5E9" />
                  <Bar dataKey="conversions" fill="#8B5CF6" />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Revenue Chart */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass rounded-xl p-6"
            >
              <h3 className="text-xl font-bold text-white mb-4">Revenue Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none' }} />
                  <Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Conversion Funnel */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass rounded-xl p-6"
            >
              <h3 className="text-xl font-bold text-white mb-4">Conversion Funnel</h3>
              <div className="space-y-4">
                {[
                  { stage: 'Visitors', count: 10000, percentage: 100 },
                  { stage: 'Leads', count: 3500, percentage: 35 },
                  { stage: 'Qualified', count: 1200, percentage: 12 },
                  { stage: 'Customers', count: 450, percentage: 4.5 }
                ].map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-300">{item.stage}</span>
                      <span className="text-white font-semibold">{item.count.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-primary-500 to-accent-500 h-3 rounded-full"
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Top Performing Campaigns */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-xl p-6 lg:col-span-2"
            >
              <h3 className="text-xl font-bold text-white mb-4">Top Performing Campaigns</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-3 text-gray-400">Campaign</th>
                      <th className="text-left py-3 text-gray-400">Platform</th>
                      <th className="text-left py-3 text-gray-400">CTR</th>
                      <th className="text-left py-3 text-gray-400">Conv. Rate</th>
                      <th className="text-left py-3 text-gray-400">CPA</th>
                      <th className="text-left py-3 text-gray-400">ROI</th>
                      <th className="text-left py-3 text-gray-400">Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: 'Summer Sale', platform: 'Google', ctr: '4.2%', convRate: '3.8%', cpa: '£25', roi: '4.5x', revenue: '£45,000' },
                      { name: 'Brand Awareness', platform: 'Facebook', ctr: '3.8%', convRate: '2.9%', cpa: '£32', roi: '3.8x', revenue: '£38,000' },
                      { name: 'Product Launch', platform: 'Native', ctr: '2.5%', convRate: '2.1%', cpa: '£45', roi: '2.9x', revenue: '£29,000' }
                    ].map((campaign, index) => (
                      <tr key={index} className="border-b border-white/5 hover:bg-white/5">
                        <td className="py-3 text-white font-medium">{campaign.name}</td>
                        <td className="py-3 text-gray-300">{campaign.platform}</td>
                        <td className="py-3 text-gray-300">{campaign.ctr}</td>
                        <td className="py-3 text-gray-300">{campaign.convRate}</td>
                        <td className="py-3 text-gray-300">{campaign.cpa}</td>
                        <td className="py-3 text-green-400 font-semibold">{campaign.roi}</td>
                        <td className="py-3 text-white font-semibold">{campaign.revenue}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        )}

        {activeTab === 'clients' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Client List */}
            <div className="lg:col-span-2 glass rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Active Clients</h3>
              <div className="space-y-4">
                {[
                  { name: 'TechCorp Ltd', industry: 'Technology', value: '£125,000', campaigns: 3, status: 'active' },
                  { name: 'Fashion Brand', industry: 'E-commerce', value: '£85,000', campaigns: 2, status: 'active' },
                  { name: 'Startup.io', industry: 'SaaS', value: '£45,000', campaigns: 1, status: 'paused' },
                  { name: 'Local Business', industry: 'Services', value: '£25,000', campaigns: 1, status: 'active' }
                ].map((client, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                    <div>
                      <h4 className="text-white font-semibold">{client.name}</h4>
                      <p className="text-gray-400 text-sm">{client.industry}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-semibold">{client.value}</p>
                      <p className="text-gray-400 text-sm">{client.campaigns} campaigns</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs text-white ${
                      client.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'
                    }`}>
                      {client.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Client Stats */}
            <div className="space-y-6">
              <div className="glass rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Client Overview</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-400 text-sm">Total Clients</p>
                    <p className="text-3xl font-bold text-white">47</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Avg. Client Value</p>
                    <p className="text-2xl font-bold text-green-400">£12,500</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Retention Rate</p>
                    <p className="text-2xl font-bold text-blue-400">98%</p>
                  </div>
                </div>
              </div>

              <div className="glass rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Industry Distribution</h3>
                <div className="space-y-3">
                  {[
                    { industry: 'E-commerce', percentage: 35 },
                    { industry: 'Technology', percentage: 28 },
                    { industry: 'Services', percentage: 20 },
                    { industry: 'Healthcare', percentage: 17 }
                  ].map((item, index) => (
                    <div key={index}>
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-300 text-sm">{item.industry}</span>
                        <span className="text-white text-sm">{item.percentage}%</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-primary-500 to-accent-500 h-2 rounded-full"
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;