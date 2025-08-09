import React from 'react';
import { motion } from 'framer-motion';
import { FaRocket, FaUsers, FaTrophy, FaLightbulb, FaHandshake, FaGlobe } from 'react-icons/fa';
import { useInView } from 'react-intersection-observer';
import CountUp from 'react-countup';

const AboutPage: React.FC = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  const values = [
    {
      icon: FaRocket,
      title: 'Innovation',
      description: 'Pushing boundaries with cutting-edge marketing technology'
    },
    {
      icon: FaHandshake,
      title: 'Partnership',
      description: 'Your success is our success - we grow together'
    },
    {
      icon: FaTrophy,
      title: 'Excellence',
      description: 'Delivering exceptional results that exceed expectations'
    },
    {
      icon: FaLightbulb,
      title: 'Creativity',
      description: 'Unique strategies tailored to your brand'
    }
  ];

  const team = [
    {
      name: 'James Mitchell',
      role: 'CEO & Founder',
      bio: '15+ years in digital marketing',
      image: '👨‍💼'
    },
    {
      name: 'Sarah Chen',
      role: 'Head of Performance',
      bio: 'Google Ads certified expert',
      image: '👩‍💼'
    },
    {
      name: 'Michael Brown',
      role: 'Creative Director',
      bio: 'Award-winning campaign designer',
      image: '👨‍🎨'
    },
    {
      name: 'Emily Davis',
      role: 'Head of Analytics',
      bio: 'Data scientist & strategist',
      image: '👩‍💻'
    }
  ];

  const milestones = [
    { year: 2018, event: 'Click2Leads founded in London' },
    { year: 2019, event: 'Became Google Premier Partner' },
    { year: 2020, event: 'Expanded to 5 countries' },
    { year: 2021, event: 'Launched AI-powered optimization' },
    { year: 2022, event: 'Reached £50M in managed ad spend' },
    { year: 2023, event: 'Opened offices in Manchester & Edinburgh' },
    { year: 2024, event: 'Celebrating 500+ successful campaigns' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-20">
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
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              About <span className="text-gradient">Click2Leads</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              We're not just another digital agency. We're your growth partners, 
              committed to transforming your digital presence and driving measurable results.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              ref={ref}
              className="glass rounded-2xl p-8"
            >
              <FaGlobe className="text-4xl text-primary-400 mb-4" />
              <h2 className="text-3xl font-bold text-white mb-4">Our Mission</h2>
              <p className="text-gray-300">
                To empower businesses of all sizes with data-driven digital marketing 
                strategies that deliver exceptional ROI and sustainable growth. We believe 
                every click should count, and every lead should matter.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              className="glass rounded-2xl p-8"
            >
              <FaRocket className="text-4xl text-accent-400 mb-4" />
              <h2 className="text-3xl font-bold text-white mb-4">Our Vision</h2>
              <p className="text-gray-300">
                To be the UK's most trusted and innovative lead generation partner, 
                setting new standards in digital marketing excellence and helping 
                businesses achieve their full potential in the digital age.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-black/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: 6, suffix: '+', label: 'Years of Excellence' },
              { value: 500, suffix: '+', label: 'Campaigns Launched' },
              { value: 50, suffix: 'M+', label: 'Ad Spend Managed' },
              { value: 98, suffix: '%', label: 'Client Retention' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                  {inView && (
                    <CountUp
                      end={stat.value}
                      duration={2.5}
                      suffix={stat.suffix}
                    />
                  )}
                </div>
                <p className="text-gray-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white text-center mb-16">
            Our Core Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="text-center"
              >
                <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <value.icon className="text-3xl text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{value.title}</h3>
                <p className="text-gray-400">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-black/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white text-center mb-16">
            Meet Our Leadership
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="glass rounded-xl p-6 text-center"
              >
                <div className="text-6xl mb-4">{member.image}</div>
                <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                <p className="text-primary-400 mb-2">{member.role}</p>
                <p className="text-gray-400 text-sm">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white text-center mb-16">
            Our Journey
          </h2>
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-primary-500 to-accent-500"></div>
            {milestones.map((milestone, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`flex items-center mb-8 ${
                  index % 2 === 0 ? 'justify-start' : 'justify-end'
                }`}
              >
                <div className={`w-5/12 ${index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}`}>
                  <div className="glass rounded-lg p-4">
                    <p className="text-primary-400 font-bold">{milestone.year}</p>
                    <p className="text-white">{milestone.event}</p>
                  </div>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-primary-500 rounded-full"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-primary-900/20 to-accent-900/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Join Our Success Story?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Let's work together to achieve extraordinary results
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all"
          >
            Start Your Journey
          </motion.button>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;