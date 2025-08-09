import React from 'react';
import { motion } from 'framer-motion';
import { FaBullhorn, FaChartLine, FaGlobe, FaRobot, FaCheckCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';

const NativeProgrammaticPage: React.FC = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  const platforms = [
    { name: 'Taboola', reach: '1.4B Users', description: 'Premium publisher network' },
    { name: 'Outbrain', reach: '1B Users', description: 'Leading content discovery' },
    { name: 'Amazon DSP', reach: '300M Users', description: 'E-commerce powerhouse' },
    { name: 'Google DV360', reach: '2B Users', description: 'Programmatic excellence' },
    { name: 'The Trade Desk', reach: '1B Users', description: 'Independent DSP leader' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-20">
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
              <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                <FaBullhorn className="text-5xl text-white" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Native & <span className="text-gradient">Programmatic Advertising</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Reach your audience at scale through premium publisher networks and 
              advanced programmatic platforms with real-time bidding optimization.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all"
            >
              Start Your Campaign
            </motion.button>
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white text-center mb-16">
            Platforms We Master
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {platforms.map((platform, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                ref={ref}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass rounded-xl p-6"
              >
                <h3 className="text-2xl font-bold text-white mb-2">{platform.name}</h3>
                <p className="text-3xl font-bold text-pink-400 mb-2">{platform.reach}</p>
                <p className="text-gray-300">{platform.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default NativeProgrammaticPage;