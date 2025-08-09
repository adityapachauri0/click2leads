import React from 'react';
import { motion } from 'framer-motion';
import { 
  FaGoogle, FaFacebookF, FaCode, FaServer, 
  FaBullhorn, FaChartBar, FaMobile, FaShieldAlt 
} from 'react-icons/fa';
import { SiGoogleads, SiGoogleanalytics } from 'react-icons/si';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';

const Services: React.FC = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  const services = [
    {
      icon: SiGoogleads,
      title: 'Google Ads Management',
      description: 'Maximize ROI with expertly managed Google Ads campaigns. Search, Display, Shopping, and YouTube.',
      features: ['Keyword Research', 'Ad Copy Optimization', 'Bid Management', 'Conversion Tracking'],
      color: 'from-blue-500 to-cyan-500',
      link: '/services/google-ads'
    },
    {
      icon: FaFacebookF,
      title: 'Facebook & Instagram Ads',
      description: 'Engage your audience with compelling social media campaigns across Meta platforms.',
      features: ['Audience Targeting', 'Creative Design', 'A/B Testing', 'Retargeting'],
      color: 'from-blue-600 to-purple-600',
      link: '/services/facebook-ads'
    },
    {
      icon: FaBullhorn,
      title: 'Native & Programmatic',
      description: 'Reach your audience through premium native networks and programmatic platforms.',
      features: ['Taboola', 'Outbrain', 'DSP Management', 'Real-time Bidding'],
      color: 'from-purple-500 to-pink-500',
      link: '/services/native-programmatic'
    },
    {
      icon: FaCode,
      title: 'Web Development',
      description: 'Custom websites and landing pages built for conversion and performance.',
      features: ['React/Next.js', 'Node.js', 'E-commerce', 'CMS Integration'],
      color: 'from-green-500 to-teal-500',
      link: '/services/web-development'
    },
    {
      icon: FaServer,
      title: 'Hosting & Infrastructure',
      description: 'Reliable, fast, and secure hosting solutions for your digital presence.',
      features: ['Cloud Hosting', 'SSL Certificates', 'CDN Setup', '99.9% Uptime'],
      color: 'from-orange-500 to-red-500',
      link: '/services/hosting'
    },
    {
      icon: SiGoogleanalytics,
      title: 'Analytics & Tracking',
      description: 'Data-driven insights to optimize your marketing performance.',
      features: ['GA4 Setup', 'Conversion Tracking', 'Custom Dashboards', 'ROI Analysis'],
      color: 'from-indigo-500 to-purple-500',
      link: '/services/analytics'
    }
  ];

  return (
    <section id="services" className="py-20 relative">
      <div className="absolute inset-0 bg-dots opacity-10"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          ref={ref}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Our <span className="text-gradient">Services</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Complete digital marketing solutions under one roof. From paid media to web development, 
            we've got everything you need to dominate online.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="glass rounded-2xl p-8 hover:bg-white/10 transition-all group"
            >
              <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${service.color} p-4 mb-6 group-hover:scale-110 transition-transform`}>
                <service.icon className="w-full h-full text-white" />
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-3">{service.title}</h3>
              <p className="text-gray-300 mb-6">{service.description}</p>
              
              <ul className="space-y-2">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-gray-400">
                    <span className="w-2 h-2 bg-primary-400 rounded-full mr-3"></span>
                    {feature}
                  </li>
                ))}
              </ul>

              <Link to={service.link}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`mt-6 w-full py-3 rounded-lg bg-gradient-to-r ${service.color} text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity`}
                >
                  Learn More
                </motion.button>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16 text-center"
        >
          <p className="text-2xl text-white mb-6">
            Ready to scale your business?
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all neon-glow"
          >
            Get a Free Consultation
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default Services;