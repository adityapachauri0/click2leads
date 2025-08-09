import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaLinkedin, FaTwitter, FaFacebook, FaShieldAlt, FaSave } from 'react-icons/fa';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

const Contact: React.FC = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    budget: '',
    service: 'Google Ads',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [autoSaveConsent, setAutoSaveConsent] = useState(false);
  const [consentDecided, setConsentDecided] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const debounceTimers = useRef<{ [key: string]: NodeJS.Timeout }>({});

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  // Phone validation - 10 or 11 digits
  const phoneRegex = /^[0-9]{10,11}$/;
  
  // Validation function
  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'email':
        if (!value) return 'Email is required';
        if (!emailRegex.test(value)) return 'Please enter a valid email address';
        return '';
      case 'phone':
        if (value && !phoneRegex.test(value.replace(/\D/g, ''))) {
          return 'Phone number must be 10 or 11 digits';
        }
        return '';
      case 'name':
        if (!value) return 'Name is required';
        if (value.length < 2) return 'Name must be at least 2 characters';
        return '';
      default:
        return '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors: { [key: string]: string } = {};
    newErrors.name = validateField('name', formData.name);
    newErrors.email = validateField('email', formData.email);
    if (formData.phone) {
      newErrors.phone = validateField('phone', formData.phone);
    }
    
    // Check if there are any errors
    const hasErrors = Object.values(newErrors).some(error => error !== '');
    if (hasErrors) {
      setErrors(newErrors);
      return;
    }
    
    setLoading(true);
    setErrors({});
    
    try {
      // Clean phone number (remove non-digits)
      const cleanPhone = formData.phone ? formData.phone.replace(/\D/g, '') : '';
      
      // Filter out empty string values
      const submitData: any = {
        name: formData.name,
        email: formData.email,
        service: formData.service || 'Google Ads',
        message: formData.message
      };
      
      // Only include optional fields if they have values
      if (formData.company) submitData.company = formData.company;
      if (cleanPhone) submitData.phone = cleanPhone;
      if (formData.budget) submitData.budget = formData.budget;
      
      const response = await axios.post('http://localhost:5003/api/leads/submit', submitData);
      setSuccess(true);
      // Navigate to thank you page after successful submission
      setTimeout(() => {
        navigate('/thank-you');
      }, 500);
    } catch (error: any) {
      console.error('Error submitting form:', error);
      if (error.response?.data?.errors) {
        const serverErrors: { [key: string]: string } = {};
        error.response.data.errors.forEach((err: any) => {
          if (err.path) serverErrors[err.path] = err.msg;
        });
        setErrors(serverErrors);
      }
    } finally {
      setLoading(false);
    }
  };

  // Get or create visitor ID
  const getVisitorId = () => {
    let visitorId = Cookies.get('visitorId');
    if (!visitorId) {
      visitorId = 'visitor-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
      Cookies.set('visitorId', visitorId, { expires: 365 });
    }
    return visitorId;
  };

  // Real-time field capture with consent
  const captureFieldData = useCallback(async (fieldName: string, value: any) => {
    if (!autoSaveConsent || !value) return;

    // Clear existing debounce timer
    if (debounceTimers.current[fieldName]) {
      clearTimeout(debounceTimers.current[fieldName]);
    }

    // Set new debounce timer (wait 1 second after user stops typing)
    debounceTimers.current[fieldName] = setTimeout(async () => {
      try {
        const payload = {
          visitorId: getVisitorId(),
          fieldName,
          fieldValue: value,
          formType: 'contact',
          timestamp: new Date().toISOString(),
          pageUrl: window.location.href
        };

        await axios.post('http://localhost:5003/api/tracking/capture-field', payload);
        setLastSaved(new Date());
        console.log(`✅ Auto-saved ${fieldName}`);
      } catch (error) {
        console.error(`Failed to capture ${fieldName}:`, error);
      }
    }, 1000);
  }, [autoSaveConsent]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Validate field on change
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
    
    // Capture field data if consent given and no validation error
    if (autoSaveConsent && !error) {
      captureFieldData(name, value);
    }
  };

  // Show consent modal after 2 seconds on first visit
  useEffect(() => {
    const hasDecided = localStorage.getItem('formAutoSaveConsent');
    if (!hasDecided) {
      const timer = setTimeout(() => {
        setShowConsentModal(true);
      }, 2000);
      return () => clearTimeout(timer);
    } else {
      setConsentDecided(true);
      setAutoSaveConsent(hasDecided === 'true');
    }
  }, []);

  const handleConsentDecision = (consent: boolean) => {
    setAutoSaveConsent(consent);
    setConsentDecided(true);
    setShowConsentModal(false);
    localStorage.setItem('formAutoSaveConsent', consent.toString());
  };

  return (
    <>
      {/* Auto-Save Consent Modal */}
      <AnimatePresence>
        {showConsentModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 max-w-md w-full border border-purple-500/20"
            >
              <div className="flex items-center mb-4">
                <FaShieldAlt className="text-purple-400 text-3xl mr-3" />
                <h3 className="text-2xl font-bold text-white">Form Auto-Save</h3>
              </div>
              
              <p className="text-gray-300 mb-6">
                Would you like us to automatically save your form progress as you type? 
                This helps prevent data loss and allows you to resume later if needed.
              </p>
              
              <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
                <h4 className="text-white font-semibold mb-2">What we save:</h4>
                <ul className="text-gray-400 text-sm space-y-1">
                  <li>• Form field values as you type</li>
                  <li>• Your progress if you leave the page</li>
                  <li>• Time spent on each field</li>
                </ul>
              </div>
              
              <div className="flex space-x-4">
                <button
                  onClick={() => handleConsentDecision(true)}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all"
                >
                  Enable Auto-Save
                </button>
                <button
                  onClick={() => handleConsentDecision(false)}
                  className="flex-1 bg-gray-700 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-600 transition-all"
                >
                  No Thanks
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Auto-Save Indicator */}
      {autoSaveConsent && lastSaved && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-20 right-4 bg-green-600/90 backdrop-blur-sm text-white px-4 py-2 rounded-lg shadow-lg z-40 flex items-center"
        >
          <FaSave className="mr-2" />
          <span className="text-sm">Auto-saved {lastSaved.toLocaleTimeString()}</span>
        </motion.div>
      )}

      <section id="contact" className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-blue-900/20"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Let's <span className="text-gradient">Grow Together</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Ready to transform your business? Get in touch for a free consultation 
            and discover how we can help you achieve extraordinary results.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-300 mb-2">Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none transition-colors ${
                      errors.name ? 'border-red-500' : 'border-white/20 focus:border-primary-500'
                    }`}
                    placeholder="John Doe"
                  />
                  {errors.name && (
                    <p className="text-red-400 text-sm mt-1">{errors.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none transition-colors ${
                      errors.email ? 'border-red-500' : 'border-white/20 focus:border-primary-500'
                    }`}
                    placeholder="john@company.com"
                  />
                  {errors.email && (
                    <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-300 mb-2">Company</label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 transition-colors"
                    placeholder="Your Company"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none transition-colors ${
                      errors.phone ? 'border-red-500' : 'border-white/20 focus:border-primary-500'
                    }`}
                    placeholder="+44 20 1234 5678"
                  />
                  {errors.phone && (
                    <p className="text-red-400 text-sm mt-1">{errors.phone}</p>
                  )}
                  <p className="text-gray-500 text-xs mt-1">Enter 10 or 11 digits only</p>
                </div>
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Service *</label>
                <select
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-primary-500 transition-colors"
                >
                  <option value="Google Ads">Google Ads</option>
                  <option value="Facebook Ads">Facebook Ads</option>
                  <option value="Native Ads">Native Ads</option>
                  <option value="Web Development">Web Development</option>
                  <option value="Hosting">Hosting</option>
                  <option value="Analytics">Analytics</option>
                  <option value="Full Package">Full Package</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Monthly Marketing Budget</label>
                <select
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-primary-500 transition-colors"
                >
                  <option value="">Select Budget Range</option>
                  <option value="Under £1,000">Less than £1,000</option>
                  <option value="£1,000 - £5,000">£1,000 - £5,000</option>
                  <option value="£5,000 - £10,000">£5,000 - £10,000</option>
                  <option value="£10,000 - £25,000">£10,000 - £25,000</option>
                  <option value="£25,000+">More than £25,000</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Message *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 transition-colors resize-none"
                  placeholder="Tell us about your project and goals..."
                />
              </div>

              {/* General error message */}
              {Object.keys(errors).length > 0 && errors.general && (
                <div className="bg-red-500/20 border border-red-500 rounded-lg p-4">
                  <p className="text-red-400">{errors.general}</p>
                </div>
              )}

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send Message'}
              </motion.button>

              {success && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-green-400 text-center"
                >
                  Thank you! We'll get back to you within 24 hours.
                </motion.p>
              )}
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">Get in Touch</h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <FaEnvelope className="text-primary-400 text-xl mt-1" />
                  <div>
                    <p className="text-gray-300 font-semibold">Email</p>
                    <a href="mailto:hello@click2leads.co.uk" className="text-gray-400 hover:text-primary-400 transition-colors">
                      hello@click2leads.co.uk
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <FaPhone className="text-primary-400 text-xl mt-1" />
                  <div>
                    <p className="text-gray-300 font-semibold">Phone</p>
                    <a href="tel:+442012345678" className="text-gray-400 hover:text-primary-400 transition-colors">
                      +44 20 1234 5678
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <FaMapMarkerAlt className="text-primary-400 text-xl mt-1" />
                  <div>
                    <p className="text-gray-300 font-semibold">Office</p>
                    <p className="text-gray-400">
                      123 Digital Street<br />
                      London, EC2A 4BX<br />
                      United Kingdom
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass rounded-xl p-6">
              <h4 className="text-xl font-bold text-white mb-4">Office Hours</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Monday - Friday</span>
                  <span className="text-gray-300">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Saturday</span>
                  <span className="text-gray-300">10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Sunday</span>
                  <span className="text-gray-300">Closed</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-xl font-bold text-white mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <motion.a
                  whileHover={{ scale: 1.2 }}
                  href="#"
                  className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <FaLinkedin className="text-xl text-white" />
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.2 }}
                  href="#"
                  className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <FaTwitter className="text-xl text-white" />
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.2 }}
                  href="#"
                  className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <FaFacebook className="text-xl text-white" />
                </motion.a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
    </>
  );
};

export default Contact;