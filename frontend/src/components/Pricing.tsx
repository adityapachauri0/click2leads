import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaCheck, FaTimes, FaRocket, FaCrown, FaFire } from 'react-icons/fa';
import { useInView } from 'react-intersection-observer';

const Pricing: React.FC = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  const plans = [
    {
      name: 'Starter',
      icon: FaRocket,
      price: { monthly: 999, annual: 899 },
      description: 'Perfect for small businesses just getting started',
      color: 'from-blue-500 to-cyan-500',
      features: [
        { name: 'Up to £5,000 ad spend management', included: true },
        { name: '1 Platform (Google or Facebook)', included: true },
        { name: 'Monthly reporting', included: true },
        { name: 'Basic landing page', included: true },
        { name: 'Email support', included: true },
        { name: 'Conversion tracking setup', included: true },
        { name: 'Custom audiences', included: false },
        { name: 'A/B testing', included: false },
        { name: 'Dedicated account manager', included: false },
      ]
    },
    {
      name: 'Growth',
      icon: FaFire,
      price: { monthly: 2499, annual: 2249 },
      description: 'Scale your business with advanced features',
      color: 'from-purple-500 to-pink-500',
      popular: true,
      features: [
        { name: 'Up to £20,000 ad spend management', included: true },
        { name: '3 Platforms (Google, Facebook, Native)', included: true },
        { name: 'Weekly reporting', included: true },
        { name: 'Custom landing pages (up to 5)', included: true },
        { name: 'Priority email & phone support', included: true },
        { name: 'Advanced conversion tracking', included: true },
        { name: 'Custom audiences & lookalikes', included: true },
        { name: 'A/B testing & optimization', included: true },
        { name: 'Dedicated account manager', included: false },
      ]
    },
    {
      name: 'Enterprise',
      icon: FaCrown,
      price: { monthly: 4999, annual: 4499 },
      description: 'Complete solution for established businesses',
      color: 'from-yellow-500 to-orange-500',
      features: [
        { name: 'Unlimited ad spend management', included: true },
        { name: 'All platforms + Programmatic', included: true },
        { name: 'Real-time reporting dashboard', included: true },
        { name: 'Unlimited landing pages', included: true },
        { name: '24/7 dedicated support', included: true },
        { name: 'Full-funnel tracking & attribution', included: true },
        { name: 'Advanced audience strategies', included: true },
        { name: 'Continuous A/B testing', included: true },
        { name: 'Dedicated account manager', included: true },
      ]
    }
  ];

  return (
    <section id="pricing" className="py-20 relative">
      <div className="absolute inset-0 bg-dots opacity-10"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Transparent <span className="text-gradient">Pricing</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            No hidden fees, no surprises. Choose the plan that fits your business needs.
          </p>

          <div className="inline-flex items-center bg-white/10 rounded-full p-1">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-full font-semibold transition-all ${
                billingCycle === 'monthly' 
                  ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white' 
                  : 'text-gray-300'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-6 py-2 rounded-full font-semibold transition-all ${
                billingCycle === 'annual' 
                  ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white' 
                  : 'text-gray-300'
              }`}
            >
              Annual
              <span className="ml-2 text-xs bg-green-500 text-white px-2 py-1 rounded-full">
                Save 10%
              </span>
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className={`relative glass rounded-2xl p-8 ${
                plan.popular ? 'border-2 border-primary-500' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-primary-500 to-accent-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${plan.color} p-4 mb-6`}>
                <plan.icon className="w-full h-full text-white" />
              </div>

              <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
              <p className="text-gray-400 mb-6">{plan.description}</p>

              <div className="mb-6">
                <span className="text-4xl font-bold text-white">
                  £{plan.price[billingCycle]}
                </span>
                <span className="text-gray-400 ml-2">/{billingCycle === 'monthly' ? 'month' : 'month'}</span>
                {billingCycle === 'annual' && (
                  <p className="text-sm text-green-400 mt-1">
                    Save £{(plan.price.monthly - plan.price.annual) * 12}/year
                  </p>
                )}
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    {feature.included ? (
                      <FaCheck className="text-green-400 mt-1 mr-3 flex-shrink-0" />
                    ) : (
                      <FaTimes className="text-red-400 mt-1 mr-3 flex-shrink-0" />
                    )}
                    <span className={`text-sm ${feature.included ? 'text-gray-300' : 'text-gray-500'}`}>
                      {feature.name}
                    </span>
                  </li>
                ))}
              </ul>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`w-full py-3 rounded-lg font-semibold transition-all ${
                  plan.popular
                    ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white'
                    : 'glass text-white hover:bg-white/20'
                }`}
              >
                Get Started
              </motion.button>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16 text-center glass rounded-2xl p-8"
        >
          <h3 className="text-2xl font-bold text-white mb-4">
            Need a Custom Solution?
          </h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            We offer tailored packages for businesses with specific requirements. 
            Let's discuss how we can help you achieve your goals.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-full font-semibold"
          >
            Contact Sales Team
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default Pricing;