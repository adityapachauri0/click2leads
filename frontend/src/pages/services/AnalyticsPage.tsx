import React from 'react';
import { motion } from 'framer-motion';
import { FaChartBar, FaChartLine, FaTag, FaMouse, FaUsersCog, FaCheckCircle, FaChartPie, FaEye } from 'react-icons/fa';
import { SiGoogleanalytics, SiGoogletagmanager, SiMicrosoftbing } from 'react-icons/si';
import { Link } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import CountUp from 'react-countup';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AnalyticsPage: React.FC = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  const services = [
    { icon: FaChartLine, title: 'Google Analytics 4', description: 'Advanced user behavior tracking and reporting' },
    { icon: FaTag, title: 'Google Tag Manager', description: 'Streamlined tag management without code changes' },
    { icon: FaMouse, title: 'Heatmap Tracking', description: 'Visual representation of user interactions' },
    { icon: FaUsersCog, title: 'Conversion Tracking', description: 'Monitor and optimize conversion paths' },
    { icon: FaChartPie, title: 'Custom Dashboards', description: 'Tailored reporting for your KPIs' },
    { icon: FaEye, title: 'User Journey Analysis', description: 'Complete funnel visualization' }
  ];

  const trackingPlatforms = [
    { icon: SiGoogleanalytics, name: 'Google Analytics', color: 'text-orange-400' },
    { icon: SiGoogletagmanager, name: 'Tag Manager', color: 'text-blue-400' },
    { icon: SiMicrosoftbing, name: 'Microsoft Clarity', color: 'text-purple-400' }
  ];

  const conversionData = [
    { month: 'Jan', conversions: 120, revenue: 24000 },
    { month: 'Feb', conversions: 145, revenue: 29000 },
    { month: 'Mar', conversions: 178, revenue: 35600 },
    { month: 'Apr', conversions: 195, revenue: 39000 },
    { month: 'May', conversions: 220, revenue: 44000 },
    { month: 'Jun', conversions: 265, revenue: 53000 }
  ];

  const trafficSources = [
    { name: 'Organic', value: 35, color: '#10b981' },
    { name: 'Paid', value: 30, color: '#8b5cf6' },
    { name: 'Social', value: 20, color: '#3b82f6' },
    { name: 'Direct', value: 15, color: '#f59e0b' }
  ];

  const features = [
    'Real-time Data Monitoring',
    'Custom Event Tracking',
    'E-commerce Analytics',
    'Cross-Domain Tracking',
    'Enhanced Conversions',
    'Server-Side Tracking',
    'Privacy-Compliant Setup',
    'Data Studio Integration'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-cyan-900 to-slate-900 pt-20">
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-data opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-2xl flex items-center justify-center">
                <FaChartBar className="text-5xl text-white" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Analytics & <span className="text-gradient">Tracking</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Transform data into decisions with comprehensive analytics setup, 
              custom tracking solutions, and actionable insights that drive growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all"
                >
                  Get Analytics Audit
                </motion.button>
              </Link>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-full font-bold text-lg border border-white/20 hover:bg-white/20 transition-all"
              >
                View Sample Report
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <div className="glass rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white mb-6">Conversion Performance</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={conversionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                  <XAxis dataKey="month" stroke="#ffffff60" />
                  <YAxis stroke="#ffffff60" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
                    labelStyle={{ color: '#fff' }}
                  />
                  <Line type="monotone" dataKey="conversions" stroke="#06b6d4" strokeWidth={3} dot={{ fill: '#06b6d4' }} />
                  <Line type="monotone" dataKey="revenue" stroke="#14b8a6" strokeWidth={3} dot={{ fill: '#14b8a6' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="glass rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white mb-6">Traffic Sources</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={trafficSources}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {trafficSources.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {[
              { label: 'Data Points Tracked', value: 500, suffix: '+' },
              { label: 'Accuracy Rate', value: 99.8, suffix: '%' },
              { label: 'Reports Generated', value: 1200, suffix: '+' },
              { label: 'ROI Improvement', value: 45, suffix: '%' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                ref={ref}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass rounded-xl p-6 text-center"
              >
                {inView && (
                  <CountUp
                    end={stat.value}
                    duration={2}
                    decimals={stat.label === 'Accuracy Rate' ? 1 : 0}
                    className="text-4xl font-bold text-white"
                    suffix={stat.suffix}
                  />
                )}
                <p className="text-gray-400 mt-2">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          <h2 className="text-4xl font-bold text-white text-center mb-16">
            Analytics Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="glass rounded-xl p-6"
              >
                <service.icon className="text-4xl text-cyan-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">{service.title}</h3>
                <p className="text-gray-400">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-black/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-white mb-6">
                Data-Driven Decision Making
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Our analytics solutions provide deep insights into user behavior, conversion paths, 
                and ROI metrics. Make informed decisions backed by comprehensive data analysis.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center text-gray-300">
                    <FaCheckCircle className="text-cyan-400 mr-2 flex-shrink-0" />
                    {feature}
                  </div>
                ))}
              </div>
            </div>
            <div className="glass rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white mb-6">Implementation Process</h3>
              <div className="space-y-4">
                {[
                  { step: 1, title: 'Audit', desc: 'Current tracking assessment' },
                  { step: 2, title: 'Strategy', desc: 'Custom tracking plan' },
                  { step: 3, title: 'Setup', desc: 'Implementation & testing' },
                  { step: 4, title: 'Training', desc: 'Team enablement' },
                  { step: 5, title: 'Optimize', desc: 'Continuous improvement' }
                ].map((item, index) => (
                  <div key={index} className="flex items-start">
                    <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold mr-4 flex-shrink-0">
                      {item.step}
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">{item.title}</h4>
                      <p className="text-gray-400 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white text-center mb-16">
            Platforms We Work With
          </h2>
          <div className="flex justify-center space-x-12">
            {trackingPlatforms.map((platform, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.1 }}
                className="text-center"
              >
                <platform.icon className={`text-6xl ${platform.color} mb-2`} />
                <p className="text-white font-semibold">{platform.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-cyan-600 to-teal-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Unlock Your Data's Potential?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Get a free analytics audit and discover hidden opportunities in your data
          </p>
          <Link to="/contact">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white text-cyan-600 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all"
            >
              Get Free Audit
            </motion.button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AnalyticsPage;