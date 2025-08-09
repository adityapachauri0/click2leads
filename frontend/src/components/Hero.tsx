import React from 'react';
import { motion } from 'framer-motion';
import { FaRocket, FaChartLine, FaUsers, FaGlobe } from 'react-icons/fa';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';

const Hero: React.FC = () => {
  const { ref, inView } = useInView({ triggerOnce: true });

  const stats = [
    { icon: FaChartLine, value: 500, suffix: '%', label: 'Average ROI' },
    { icon: FaUsers, value: 10000, suffix: '+', label: 'Leads Generated' },
    { icon: FaGlobe, value: 50, suffix: '+', label: 'Happy Clients' },
    { icon: FaRocket, value: 98, suffix: '%', label: 'Success Rate' },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      <div className="absolute inset-0 bg-grid opacity-20"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Transform Clicks Into
            <span className="block text-gradient mt-2">Premium Leads</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Dominate your market with our comprehensive lead generation solutions. 
            Google Ads, Facebook, Native, Programmatic - We master them all.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all neon-glow"
            >
              Start Generating Leads
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 glass text-white rounded-full font-bold text-lg hover:bg-white/20 transition-all"
            >
              View Our Portfolio
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass rounded-xl p-6 hover:bg-white/20 transition-all"
            >
              <stat.icon className="text-4xl text-primary-400 mx-auto mb-3" />
              <div className="text-3xl font-bold text-white">
                {inView && (
                  <CountUp
                    end={stat.value}
                    duration={2.5}
                    suffix={stat.suffix}
                  />
                )}
              </div>
              <p className="text-gray-400 mt-2">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-16"
        >
          <p className="text-gray-400 mb-4">Trusted by leading brands</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-50">
            {['Google Partner', 'Meta Business', 'Shopify Plus', 'HubSpot', 'Klaviyo'].map((partner) => (
              <div key={partner} className="text-white text-lg font-semibold">
                {partner}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;