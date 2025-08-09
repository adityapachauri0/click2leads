import React, { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { Toaster } from 'react-hot-toast';
import axios from 'axios';
import Cookies from 'js-cookie';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import Analytics from './components/Analytics';
import CaseStudies from './components/CaseStudies';
import Pricing from './components/Pricing';
import Contact from './components/Contact';
import Footer from './components/Footer';
import FloatingElements from './components/FloatingElements';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from './components/ProtectedRoute';

// Lazy load pages for better performance
const GoogleAdsPage = lazy(() => import('./pages/services/GoogleAdsPage'));
const FacebookAdsPage = lazy(() => import('./pages/services/FacebookAdsPage'));
const NativeProgrammaticPage = lazy(() => import('./pages/services/NativeProgrammaticPage'));
const WebDevelopmentPage = lazy(() => import('./pages/services/WebDevelopmentPage'));
const HostingPage = lazy(() => import('./pages/services/HostingPage'));
const AnalyticsPage = lazy(() => import('./pages/services/AnalyticsPage'));
const AboutPage = lazy(() => import('./pages/company/AboutPage'));
const Dashboard = lazy(() => import('./pages/dashboard/Dashboard'));
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const ThankYou = lazy(() => import('./components/ThankYou'));

const LoadingSpinner = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
    <div className="text-center">
      <svg className="animate-spin h-12 w-12 text-white mx-auto mb-4" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
      <p className="text-white">Loading...</p>
    </div>
  </div>
);

function App() {
  // Set axios defaults on app initialization
  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <Toaster position="top-right" />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <FloatingElements />
        <div className="relative z-10">
          <Navbar />
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={
                <>
                  <Hero />
                  <Services />
                  <Analytics />
                  <CaseStudies />
                  <Pricing />
                  <Contact />
                </>
              } />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/services" element={<Services />} />
              <Route path="/services/google-ads" element={<GoogleAdsPage />} />
              <Route path="/services/facebook-ads" element={<FacebookAdsPage />} />
              <Route path="/services/native-programmatic" element={<NativeProgrammaticPage />} />
              <Route path="/services/web-development" element={<WebDevelopmentPage />} />
              <Route path="/services/hosting" element={<HostingPage />} />
              <Route path="/services/analytics" element={<AnalyticsPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/case-studies" element={<CaseStudies />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/thank-you" element={<ThankYou />} />
            </Routes>
          </Suspense>
          <Footer />
          <ScrollToTop />
        </div>
      </div>
      </Router>
    </Provider>
  );
}

export default App;
