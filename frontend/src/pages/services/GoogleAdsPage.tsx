import React from 'react';
import { motion } from 'framer-motion';
import { FaGoogle, FaChartLine, FaRocket, FaShieldAlt, FaCog, FaUsers, FaCheckCircle, FaArrowRight } from 'react-icons/fa';
import { SiGoogleads } from 'react-icons/si';
import { Link } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';

const GoogleAdsPage: React.FC = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  const features = [
    {
      icon: FaChartLine,
      title: 'Performance Max Campaigns',
      description: 'Leverage Google\'s AI to maximize conversions across all channels'
    },
    {
      icon: FaRocket,
      title: 'Smart Bidding Strategies',
      description: 'Automated bid optimization for maximum ROI'
    },
    {
      icon: FaShieldAlt,
      title: 'Brand Protection',
      description: 'Protect your brand with negative keywords and placement exclusions'
    },
    {
      icon: FaCog,
      title: 'Advanced Automation',
      description: 'Custom scripts and rules for efficient campaign management'
    },
    {
      icon: FaUsers,
      title: 'Audience Targeting',
      description: 'Precise targeting with custom audiences and lookalikes'
    },
    {
      icon: FaCheckCircle,
      title: 'Quality Score Optimization',
      description: 'Improve ad relevance and reduce costs'
    }
  ];

  const campaignTypes = [
    { name: 'Search Ads', description: 'Capture high-intent users searching for your products' },
    { name: 'Shopping Ads', description: 'Showcase your products with images and prices' },
    { name: 'Display Ads', description: 'Build awareness across 2 million websites' },
    { name: 'YouTube Ads', description: 'Engage audiences with video content' },
    { name: 'App Campaigns', description: 'Drive app installs and engagement' },
    { name: 'Local Campaigns', description: 'Drive foot traffic to physical locations' }
  ];

  const process = [
    { step: 1, title: 'Audit & Strategy', description: 'Comprehensive account audit and strategy development' },
    { step: 2, title: 'Setup & Structure', description: 'Optimal campaign structure and settings' },
    { step: 3, title: 'Launch & Test', description: 'Strategic launch with A/B testing' },
    { step: 4, title: 'Optimize & Scale', description: 'Continuous optimization and scaling' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 pt-20">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                <SiGoogleads className="text-5xl text-white" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Google Ads <span className="text-gradient">Management</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Maximize your ROI with expertly managed Google Ads campaigns. 
              From search to shopping, we master every aspect of Google's advertising ecosystem.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all"
              >
                Get Free Audit
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 glass text-white rounded-full font-bold text-lg hover:bg-white/20 transition-all"
              >
                View Case Studies
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Why Choose Our Google Ads Service?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              We combine cutting-edge technology with proven strategies to deliver exceptional results
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass rounded-xl p-8 hover:bg-white/10 transition-all"
              >
                <feature.icon className="text-4xl text-blue-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Campaign Types */}
      <section className="py-20 bg-black/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white text-center mb-16">
            Campaign Types We Master
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaignTypes.map((type, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl p-6 hover:border-blue-400/40 transition-all"
              >
                <h3 className="text-xl font-bold text-white mb-2">{type.name}</h3>
                <p className="text-gray-400">{type.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white text-center mb-16">
            Our Proven Process
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {process.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-gray-400">{item.description}</p>
                {index < process.length - 1 && (
                  <FaArrowRight className="text-blue-400 mx-auto mt-4 hidden lg:block" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-20 bg-gradient-to-br from-blue-900/20 to-cyan-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-white mb-6">
                Guaranteed Results
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                We're so confident in our ability to deliver results that we offer 
                performance-based pricing options. Your success is our success.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  'Average 300% ROI increase in 90 days',
                  'Reduce cost per acquisition by 40%',
                  'Increase conversion rates by 60%',
                  'Full transparency with real-time reporting',
                  'Google Premier Partner certified team'
                ].map((item, index) => (
                  <li key={index} className="flex items-center text-gray-300">
                    <FaCheckCircle className="text-green-400 mr-3" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/contact">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all"
                >
                  Start Your Campaign
                </motion.button>
              </Link>
            </div>
            <div className="glass rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white mb-6">Quick Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-3xl font-bold text-blue-400">£50M+</p>
                  <p className="text-gray-400">Ad Spend Managed</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-3xl font-bold text-cyan-400">500+</p>
                  <p className="text-gray-400">Campaigns Launched</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-3xl font-bold text-green-400">4.8x</p>
                  <p className="text-gray-400">Average ROAS</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-3xl font-bold text-purple-400">98%</p>
                  <p className="text-gray-400">Client Retention</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Dominate Google Ads?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Get a free audit and discover how much revenue you're leaving on the table
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all neon-glow"
          >
            Get Your Free Audit Now
          </motion.button>
        </div>
      </section>
    </div>
  );
};

export default GoogleAdsPage;