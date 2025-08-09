import React from 'react';
import { motion } from 'framer-motion';
import { FaFacebookF, FaInstagram, FaChartLine, FaUsers, FaMobile, FaVideo, FaCheckCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';

const FacebookAdsPage: React.FC = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  const platforms = [
    { name: 'Facebook', users: '2.9B', description: 'Largest social network worldwide' },
    { name: 'Instagram', users: '2B', description: 'Visual-first platform for younger audiences' },
    { name: 'Messenger', users: '1.3B', description: 'Direct messaging and chatbot marketing' },
    { name: 'WhatsApp', users: '2B', description: 'Business messaging and customer support' },
    { name: 'Audience Network', users: '1B+', description: 'Extended reach across apps and websites' }
  ];

  const adFormats = [
    {
      icon: FaVideo,
      title: 'Video Ads',
      description: 'Engaging video content that captures attention in feeds and stories'
    },
    {
      icon: FaMobile,
      title: 'Carousel Ads',
      description: 'Showcase multiple products or features in a single ad'
    },
    {
      icon: FaUsers,
      title: 'Collection Ads',
      description: 'Immersive shopping experiences with instant loading'
    },
    {
      icon: FaChartLine,
      title: 'Dynamic Ads',
      description: 'Automatically show relevant products to interested users'
    }
  ];

  const targetingOptions = [
    'Demographics', 'Interests', 'Behaviors', 'Custom Audiences',
    'Lookalike Audiences', 'Location', 'Life Events', 'Purchase Intent'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-20">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-dots opacity-20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
                <FaFacebookF className="text-5xl text-white" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Facebook & Instagram <span className="text-gradient">Advertising</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Reach 3.7 billion users across Meta's family of apps. 
              Drive engagement, conversions, and brand awareness with precision targeting.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all"
              >
                Start Advertising Today
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 glass text-white rounded-full font-bold text-lg hover:bg-white/20 transition-all"
              >
                Download Strategy Guide
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Platforms */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Advertise Across Meta's Ecosystem
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Reach your audience wherever they spend their time
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {platforms.map((platform, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="glass rounded-xl p-6 hover:bg-white/10 transition-all"
              >
                <h3 className="text-2xl font-bold text-white mb-2">{platform.name}</h3>
                <p className="text-3xl font-bold text-purple-400 mb-2">{platform.users}</p>
                <p className="text-gray-300">{platform.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Ad Formats */}
      <section className="py-20 bg-black/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white text-center mb-16">
            Powerful Ad Formats
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {adFormats.map((format, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="flex items-start space-x-4 glass rounded-xl p-6"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <format.icon className="text-2xl text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">{format.title}</h3>
                  <p className="text-gray-300">{format.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Targeting */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-white mb-6">
                Laser-Focused Targeting
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Meta's advertising platform offers the most sophisticated targeting 
                options in the industry. Reach exactly who you want, when you want.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {targetingOptions.map((option, index) => (
                  <div key={index} className="flex items-center text-gray-300">
                    <FaCheckCircle className="text-purple-400 mr-2" />
                    {option}
                  </div>
                ))}
              </div>
            </div>
            <div className="glass rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white mb-6">Campaign Performance</h3>
              <div className="space-y-4">
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-400">Average CTR</span>
                    <span className="text-white font-bold">3.8%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full" style={{ width: '76%' }}></div>
                  </div>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-400">Conversion Rate</span>
                    <span className="text-white font-bold">5.2%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-400">ROAS</span>
                    <span className="text-white font-bold">4.2x</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full" style={{ width: '84%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-blue-900/20 to-purple-900/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Scale with Social Advertising?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join hundreds of businesses achieving exceptional results with our Meta advertising expertise
          </p>
          <Link to="/contact">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all"
            >
              Get Started Now
            </motion.button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default FacebookAdsPage;