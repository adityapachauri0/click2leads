import React from 'react';
import { motion } from 'framer-motion';
import { FaServer, FaShieldAlt, FaTachometerAlt, FaCloud, FaLock, FaCheckCircle, FaInfinity, FaRocket } from 'react-icons/fa';
import { SiCloudflare, SiAmazonaws, SiGooglecloud } from 'react-icons/si';
import { Link } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import CountUp from 'react-countup';

const HostingPage: React.FC = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  const features = [
    { icon: FaTachometerAlt, title: '99.9% Uptime', description: 'Guaranteed reliability for your business' },
    { icon: FaShieldAlt, title: 'DDoS Protection', description: 'Advanced security against attacks' },
    { icon: FaCloud, title: 'Auto Scaling', description: 'Grow seamlessly with demand' },
    { icon: FaLock, title: 'SSL Certificates', description: 'Free SSL for all domains' },
    { icon: FaInfinity, title: 'Unlimited Bandwidth', description: 'No traffic restrictions' },
    { icon: FaRocket, title: 'CDN Integration', description: 'Global content delivery' }
  ];

  const providers = [
    { icon: SiAmazonaws, name: 'AWS', color: 'text-orange-400' },
    { icon: SiGooglecloud, name: 'Google Cloud', color: 'text-blue-400' },
    { icon: SiCloudflare, name: 'Cloudflare', color: 'text-orange-500' }
  ];

  const plans = [
    {
      name: 'Starter',
      price: '£49',
      features: ['5GB SSD Storage', '100GB Bandwidth', '1 Website', 'Free SSL', 'Daily Backups', 'Email Support'],
      color: 'from-blue-500 to-cyan-500'
    },
    {
      name: 'Business',
      price: '£149',
      features: ['50GB SSD Storage', 'Unlimited Bandwidth', '10 Websites', 'Free SSL', 'Hourly Backups', 'Priority Support', 'CDN Integration'],
      color: 'from-purple-500 to-pink-500',
      popular: true
    },
    {
      name: 'Enterprise',
      price: '£499',
      features: ['500GB SSD Storage', 'Unlimited Everything', 'Unlimited Websites', 'Advanced Security', 'Real-time Backups', '24/7 Phone Support', 'Dedicated Account Manager'],
      color: 'from-orange-500 to-red-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 pt-20">
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-circuit opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-2xl flex items-center justify-center">
                <FaServer className="text-5xl text-white" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Hosting & <span className="text-gradient">Infrastructure</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Enterprise-grade hosting solutions with guaranteed uptime, blazing-fast speeds, 
              and bulletproof security for your digital presence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all"
                >
                  Get Started Now
                </motion.button>
              </Link>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-full font-bold text-lg border border-white/20 hover:bg-white/20 transition-all"
              >
                View Demo
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {[
              { label: 'Uptime', value: 99.9, suffix: '%' },
              { label: 'Response Time', value: 200, suffix: 'ms' },
              { label: 'Daily Backups', value: 24, suffix: '/7' },
              { label: 'Support', value: 24, suffix: '/7' }
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
                    decimals={stat.label === 'Uptime' ? 1 : 0}
                    className="text-4xl font-bold text-white"
                    suffix={stat.suffix}
                  />
                )}
                <p className="text-gray-400 mt-2">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          <h2 className="text-4xl font-bold text-white text-center mb-16">
            Enterprise Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="glass rounded-xl p-6"
              >
                <feature.icon className="text-4xl text-indigo-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-black/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white text-center mb-16">
            Hosting Plans
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className={`glass rounded-2xl p-8 ${plan.popular ? 'ring-2 ring-purple-500' : ''}`}
              >
                {plan.popular && (
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-bold inline-block mb-4">
                    Most Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-5xl font-bold text-white">{plan.price}</span>
                  <span className="text-gray-400">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-gray-300">
                      <FaCheckCircle className="text-green-400 mr-3" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-full py-3 bg-gradient-to-r ${plan.color} text-white rounded-full font-bold`}
                >
                  Choose {plan.name}
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white text-center mb-16">
            Powered By Industry Leaders
          </h2>
          <div className="flex justify-center space-x-12">
            {providers.map((provider, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.1 }}
                className="text-center"
              >
                <provider.icon className={`text-6xl ${provider.color} mb-2`} />
                <p className="text-white font-semibold">{provider.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-indigo-600 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Scale Your Infrastructure?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of businesses running on our reliable hosting platform
          </p>
          <Link to="/contact">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white text-indigo-600 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all"
            >
              Start Free Trial
            </motion.button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HostingPage;