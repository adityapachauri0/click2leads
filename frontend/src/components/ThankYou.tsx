import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  FaCheckCircle, 
  FaEnvelope, 
  FaClock, 
  FaPhone, 
  FaCalendarAlt,
  FaRocket,
  FaChartLine,
  FaUsers,
  FaLinkedin,
  FaTwitter,
  FaFacebook
} from 'react-icons/fa';
const ThankYou: React.FC = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    // Try to use confetti if available
    try {
      const confetti = require('canvas-confetti');
      // Trigger confetti animation
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
      };

      const interval: NodeJS.Timer = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        if (typeof confetti === 'function') {
          confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
          });
          confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
          });
        }
      }, 250);
    } catch (error) {
      console.log('Confetti animation not available');
    }

    // Countdown timer
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          navigate('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(countdownInterval);
    };
  }, [navigate]);

  const nextSteps = [
    {
      icon: <FaClock className="text-3xl" />,
      title: "Within 30 Minutes",
      description: "You'll receive a confirmation email with your inquiry details"
    },
    {
      icon: <FaPhone className="text-3xl" />,
      title: "Within 2 Hours",
      description: "Our expert will review your requirements and prepare a strategy"
    },
    {
      icon: <FaCalendarAlt className="text-3xl" />,
      title: "Within 24 Hours",
      description: "We'll contact you to schedule a free consultation call"
    }
  ];

  const resources = [
    {
      icon: <FaRocket className="text-2xl" />,
      title: "PPC Campaign Guide",
      description: "Learn the fundamentals of successful PPC campaigns",
      link: "#"
    },
    {
      icon: <FaChartLine className="text-2xl" />,
      title: "ROI Calculator",
      description: "Calculate your potential return on ad spend",
      link: "#"
    },
    {
      icon: <FaUsers className="text-2xl" />,
      title: "Success Stories",
      description: "See how we've helped businesses like yours",
      link: "#case-studies"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Success Message */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-24 h-24 bg-green-500 rounded-full mb-6">
            <FaCheckCircle className="text-white text-5xl" />
          </div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-6xl font-bold text-white mb-4"
          >
            Thank You!
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-300 max-w-2xl mx-auto mb-8"
          >
            Your message has been received successfully. We're excited to help you transform your digital marketing and achieve extraordinary results!
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="inline-flex items-center space-x-2 text-gray-400"
          >
            <FaEnvelope className="text-xl" />
            <span>Check your inbox for confirmation</span>
          </motion.div>
        </motion.div>

        {/* Next Steps Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-10">
            What Happens Next?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {nextSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + index * 0.2 }}
                className="relative"
              >
                <div className="glass rounded-xl p-6 h-full hover:bg-white/10 transition-all">
                  <div className="text-primary-400 mb-4">{step.icon}</div>
                  <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
                  <p className="text-gray-400">{step.description}</p>
                </div>
                {index < nextSteps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <div className="w-8 h-0.5 bg-gradient-to-r from-primary-500 to-accent-500"></div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Helpful Resources */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-10">
            While You Wait, Check These Out
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {resources.map((resource, index) => (
              <motion.a
                key={index}
                href={resource.link}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="glass rounded-xl p-6 hover:bg-white/10 transition-all cursor-pointer group"
              >
                <div className="text-primary-400 mb-4 group-hover:text-accent-400 transition-colors">
                  {resource.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{resource.title}</h3>
                <p className="text-gray-400">{resource.description}</p>
                <div className="mt-4 text-primary-400 group-hover:text-accent-400 transition-colors">
                  Learn More →
                </div>
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Social Follow */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
          className="text-center mb-12"
        >
          <h3 className="text-2xl font-bold text-white mb-4">Stay Connected</h3>
          <p className="text-gray-400 mb-6">Follow us for digital marketing tips and insights</p>
          
          <div className="flex justify-center space-x-4">
            <motion.a
              whileHover={{ scale: 1.2, rotate: 5 }}
              href="#"
              className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <FaLinkedin className="text-xl text-white" />
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.2, rotate: -5 }}
              href="#"
              className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <FaTwitter className="text-xl text-white" />
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.2, rotate: 5 }}
              href="#"
              className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <FaFacebook className="text-xl text-white" />
            </motion.a>
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/')}
            className="px-8 py-4 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            Back to Homepage
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/#case-studies')}
            className="px-8 py-4 bg-white/10 text-white rounded-lg font-semibold hover:bg-white/20 transition-all"
          >
            View Case Studies
          </motion.button>
        </motion.div>

        {/* Auto-redirect notice */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="text-center text-gray-500 mt-8 text-sm"
        >
          Redirecting to homepage in {countdown} seconds...
        </motion.p>
      </div>

      {/* Custom CSS for animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}} />
    </div>
  );
};

export default ThankYou;