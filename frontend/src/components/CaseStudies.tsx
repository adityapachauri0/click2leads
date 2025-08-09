import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowRight, FaQuoteLeft, FaChartLine, FaUsers, FaPoundSign } from 'react-icons/fa';
import { useInView } from 'react-intersection-observer';

const CaseStudies: React.FC = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const [selectedStudy, setSelectedStudy] = useState(0);

  const caseStudies = [
    {
      client: 'E-Commerce Fashion Brand',
      industry: 'Fashion & Retail',
      challenge: 'Low conversion rates and high CAC on Google Ads',
      solution: 'Implemented Smart Shopping campaigns with dynamic remarketing and optimized product feed',
      results: {
        roi: '450%',
        leads: '2,500+',
        conversion: '3.8%',
        revenue: '£285,000'
      },
      testimonial: 'Click2Leads transformed our digital marketing. Our ROAS increased by 450% in just 3 months!',
      image: 'https://source.unsplash.com/800x600/?fashion,ecommerce'
    },
    {
      client: 'SaaS Startup',
      industry: 'Technology',
      challenge: 'Struggling to generate qualified B2B leads',
      solution: 'LinkedIn Ads + Google Ads strategy with landing page optimization',
      results: {
        roi: '380%',
        leads: '850+',
        conversion: '5.2%',
        revenue: '£420,000'
      },
      testimonial: 'The quality of leads we receive now is exceptional. Our sales team is thrilled!',
      image: 'https://source.unsplash.com/800x600/?technology,software'
    },
    {
      client: 'Real Estate Agency',
      industry: 'Real Estate',
      challenge: 'High competition and expensive CPCs in local market',
      solution: 'Local SEO + Facebook Lead Ads with instant follow-up automation',
      results: {
        roi: '520%',
        leads: '1,200+',
        conversion: '4.5%',
        revenue: '£750,000'
      },
      testimonial: 'Click2Leads helped us dominate our local market. Best investment we ever made!',
      image: 'https://source.unsplash.com/800x600/?realestate,property'
    },
    {
      client: 'Healthcare Clinic',
      industry: 'Healthcare',
      challenge: 'Need to increase patient bookings while maintaining compliance',
      solution: 'HIPAA-compliant campaigns across Google and social media',
      results: {
        roi: '320%',
        leads: '600+',
        conversion: '6.8%',
        revenue: '£180,000'
      },
      testimonial: 'Professional, compliant, and results-driven. Exactly what we needed!',
      image: 'https://source.unsplash.com/800x600/?healthcare,medical'
    }
  ];

  return (
    <section id="case-studies" className="py-20 relative">
      <div className="absolute inset-0 bg-grid opacity-10"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Success <span className="text-gradient">Stories</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Real results from real clients. See how we've helped businesses 
            like yours achieve extraordinary growth.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            {caseStudies.map((study, index) => (
              <motion.div
                key={index}
                whileHover={{ x: 10 }}
                onClick={() => setSelectedStudy(index)}
                className={`glass rounded-xl p-6 cursor-pointer transition-all ${
                  selectedStudy === index ? 'bg-white/20 border-primary-500' : ''
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-xl font-bold text-white">{study.client}</h3>
                    <p className="text-gray-400">{study.industry}</p>
                  </div>
                  <FaArrowRight className={`text-2xl transition-transform ${
                    selectedStudy === index ? 'text-primary-400 rotate-90' : 'text-gray-400'
                  }`} />
                </div>
                <div className="flex gap-4 mt-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary-400">{study.results.roi}</p>
                    <p className="text-xs text-gray-400">ROI</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-accent-400">{study.results.leads}</p>
                    <p className="text-xs text-gray-400">Leads</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-400">{study.results.revenue}</p>
                    <p className="text-xs text-gray-400">Revenue</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={selectedStudy}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.6 }}
              className="glass rounded-2xl p-8 h-fit"
            >
              <div className="mb-6 rounded-xl overflow-hidden h-48 bg-gradient-to-br from-primary-500/20 to-accent-500/20">
                <div className="w-full h-full flex items-center justify-center">
                  <FaChartLine className="text-6xl text-white/30" />
                </div>
              </div>

              <h3 className="text-2xl font-bold text-white mb-2">
                {caseStudies[selectedStudy].client}
              </h3>
              <p className="text-primary-400 mb-4">{caseStudies[selectedStudy].industry}</p>

              <div className="space-y-4 mb-6">
                <div>
                  <h4 className="text-sm font-semibold text-gray-400 uppercase mb-2">Challenge</h4>
                  <p className="text-gray-300">{caseStudies[selectedStudy].challenge}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-400 uppercase mb-2">Solution</h4>
                  <p className="text-gray-300">{caseStudies[selectedStudy].solution}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white/5 rounded-lg p-4 text-center">
                  <FaChartLine className="text-3xl text-primary-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{caseStudies[selectedStudy].results.roi}</p>
                  <p className="text-sm text-gray-400">Return on Investment</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4 text-center">
                  <FaUsers className="text-3xl text-accent-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{caseStudies[selectedStudy].results.leads}</p>
                  <p className="text-sm text-gray-400">Qualified Leads</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4 text-center">
                  <FaPoundSign className="text-3xl text-green-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{caseStudies[selectedStudy].results.revenue}</p>
                  <p className="text-sm text-gray-400">Revenue Generated</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4 text-center">
                  <div className="text-3xl text-yellow-400 mx-auto mb-2">%</div>
                  <p className="text-2xl font-bold text-white">{caseStudies[selectedStudy].results.conversion}</p>
                  <p className="text-sm text-gray-400">Conversion Rate</p>
                </div>
              </div>

              <div className="border-t border-white/10 pt-6">
                <FaQuoteLeft className="text-2xl text-primary-400 mb-3" />
                <p className="text-gray-300 italic">
                  "{caseStudies[selectedStudy].testimonial}"
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-6 w-full py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-lg font-semibold"
              >
                Get Similar Results
              </motion.button>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default CaseStudies;