import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Analytics: React.FC = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  const performanceData = [
    { month: 'Jan', leads: 450, conversions: 120, revenue: 45000 },
    { month: 'Feb', leads: 520, conversions: 145, revenue: 52000 },
    { month: 'Mar', leads: 680, conversions: 190, revenue: 68000 },
    { month: 'Apr', leads: 750, conversions: 220, revenue: 78000 },
    { month: 'May', leads: 890, conversions: 280, revenue: 92000 },
    { month: 'Jun', leads: 1020, conversions: 350, revenue: 115000 },
  ];

  const channelData = [
    { name: 'Google Ads', value: 35, color: '#0EA5E9' },
    { name: 'Facebook', value: 28, color: '#8B5CF6' },
    { name: 'Native', value: 20, color: '#EC4899' },
    { name: 'Organic', value: 17, color: '#10B981' },
  ];

  const conversionData = [
    { stage: 'Visitors', value: 10000 },
    { stage: 'Leads', value: 3500 },
    { stage: 'Qualified', value: 1200 },
    { stage: 'Customers', value: 450 },
  ];

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-blue-900/20"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Real-Time <span className="text-gradient">Analytics Dashboard</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Track your campaign performance with our advanced analytics. 
            Make data-driven decisions with real-time insights.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="glass rounded-2xl p-6"
          >
            <h3 className="text-xl font-bold text-white mb-4">Performance Overview</h3>
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
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none' }} />
                <Area type="monotone" dataKey="leads" stroke="#0EA5E9" fillOpacity={1} fill="url(#colorLeads)" />
                <Area type="monotone" dataKey="conversions" stroke="#8B5CF6" fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="glass rounded-2xl p-6"
          >
            <h3 className="text-xl font-bold text-white mb-4">Channel Distribution</h3>
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

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass rounded-2xl p-6"
          >
            <h3 className="text-xl font-bold text-white mb-4">Conversion Funnel</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={conversionData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis type="number" stroke="#9CA3AF" />
                <YAxis dataKey="stage" type="category" stroke="#9CA3AF" />
                <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none' }} />
                <Bar dataKey="value" fill="url(#gradient)" />
                <defs>
                  <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#0EA5E9" />
                    <stop offset="100%" stopColor="#8B5CF6" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="glass rounded-2xl p-6"
          >
            <h3 className="text-xl font-bold text-white mb-4">Key Metrics</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Avg. CPC', value: '£2.45', change: '-12%', positive: true },
                { label: 'CTR', value: '4.8%', change: '+23%', positive: true },
                { label: 'Conv. Rate', value: '3.2%', change: '+8%', positive: true },
                { label: 'ROAS', value: '4.5x', change: '+15%', positive: true },
              ].map((metric, index) => (
                <div key={index} className="bg-white/5 rounded-lg p-4">
                  <p className="text-gray-400 text-sm">{metric.label}</p>
                  <p className="text-2xl font-bold text-white">{metric.value}</p>
                  <p className={`text-sm ${metric.positive ? 'text-green-400' : 'text-red-400'}`}>
                    {metric.change}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-12 text-center"
        >
          <p className="text-lg text-gray-300 mb-4">
            Want to see these results for your business?
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-full font-semibold"
          >
            Request a Demo
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default Analytics;