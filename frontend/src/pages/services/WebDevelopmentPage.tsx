import React from 'react';
import { motion } from 'framer-motion';
import { FaCode, FaReact, FaNodeJs, FaMobile, FaShoppingCart, FaCheckCircle } from 'react-icons/fa';
import { SiNextdotjs, SiTypescript, SiMongodb } from 'react-icons/si';
import { Link } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';

const WebDevelopmentPage: React.FC = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  const technologies = [
    { icon: FaReact, name: 'React', description: 'Modern UI development' },
    { icon: SiNextdotjs, name: 'Next.js', description: 'Full-stack framework' },
    { icon: FaNodeJs, name: 'Node.js', description: 'Backend development' },
    { icon: SiTypescript, name: 'TypeScript', description: 'Type-safe code' },
    { icon: SiMongodb, name: 'MongoDB', description: 'NoSQL database' },
    { icon: FaShoppingCart, name: 'E-commerce', description: 'Online stores' }
  ];

  const services = [
    'Custom Web Applications',
    'E-commerce Solutions',
    'Landing Page Development',
    'Progressive Web Apps',
    'API Development',
    'CMS Integration',
    'Performance Optimization',
    'Mobile-First Design'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-slate-900 pt-20">
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
              <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl flex items-center justify-center">
                <FaCode className="text-5xl text-white" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Web <span className="text-gradient">Development</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Custom websites and applications built for performance, conversion, 
              and exceptional user experience using cutting-edge technologies.
            </p>
            <Link to="/contact">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all"
              >
                Start Your Project
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white text-center mb-16">
            Technologies We Use
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {technologies.map((tech, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                ref={ref}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="glass rounded-xl p-6 text-center"
              >
                <tech.icon className="text-4xl text-green-400 mx-auto mb-3" />
                <h3 className="text-white font-bold mb-1">{tech.name}</h3>
                <p className="text-gray-400 text-sm">{tech.description}</p>
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
                Built for Growth
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Every website we build is optimized for conversions, speed, and scalability. 
                We don't just build websites; we create digital experiences that drive results.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {services.map((service, index) => (
                  <div key={index} className="flex items-center text-gray-300">
                    <FaCheckCircle className="text-green-400 mr-2" />
                    {service}
                  </div>
                ))}
              </div>
            </div>
            <div className="glass rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white mb-6">Performance Metrics</h3>
              <div className="space-y-4">
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-400">Page Speed Score</span>
                    <span className="text-white font-bold">98/100</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div className="bg-gradient-to-r from-green-500 to-teal-500 h-2 rounded-full" style={{ width: '98%' }}></div>
                  </div>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-400">Mobile Responsive</span>
                    <span className="text-white font-bold">100%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div className="bg-gradient-to-r from-green-500 to-teal-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-400">SEO Score</span>
                    <span className="text-white font-bold">95/100</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div className="bg-gradient-to-r from-green-500 to-teal-500 h-2 rounded-full" style={{ width: '95%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WebDevelopmentPage;