'use client'

import { motion } from 'framer-motion'

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen py-20">
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-8">
            <span className="gradient-text">Cookie Policy</span>
          </h1>

          <div className="prose prose-invert max-w-none">
            <div className="glass-morphism rounded-2xl p-8 mb-8">
              <p className="text-lg text-white/80 mb-6">
                Our website uses cookies to distinguish you from other users of our website. This helps us to provide you with a good experience when you browse our website and also allows us to improve the experience of using our website. By continuing to browse the website, you are agreeing to our use of cookies.
              </p>

              <p className="text-white/80 mb-6">
                A cookie is a small file of letters and numbers that we store on your browser or the hard drive of your computer with your agreement. Cookies contain information that is transferred to your computer's hard drive.
              </p>
            </div>

            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="glass-morphism rounded-xl p-6">
                <h2 className="text-2xl font-display font-semibold mb-4 text-electric-blue">
                  We use the following cookies:
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-white">Strictly necessary cookies</h3>
                    <p className="text-white/70">
                      These are cookies that are required for the operation of our website.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-white">Analytical and performance cookies</h3>
                    <p className="text-white/70">
                      These allow us to recognise and count the number of visitors and to see how visitors move around our website when they are using it. These cookies are anonymous.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-white">Functionality cookies</h3>
                    <p className="text-white/70">
                      These are used to recognise you when you return to our website. This enables us to personalise our content for you, greet you by name and remember your preferences (for example, your previous home improvement requirements).
                    </p>
                  </div>
                </div>
              </div>

              <div className="glass-morphism rounded-xl p-6">
                <h2 className="text-2xl font-display font-semibold mb-4 text-neon-purple">
                  Third-party cookies
                </h2>
                <p className="text-white/80">
                  Please note that third parties (including, for example, advertising networks and providers of external services like web traffic analysis services) may also use cookies, over which we have no control. These cookies are likely to be analytical and performance cookies or targeting cookies.
                </p>
              </div>

              <div className="glass-morphism rounded-xl p-6">
                <h2 className="text-2xl font-display font-semibold mb-4 text-electric-blue">
                  Managing cookies
                </h2>
                <p className="text-white/80 mb-4">
                  You can block cookies by activating the setting on your browser that allows you to refuse the setting of all or some cookies. However, if you use your browser settings to block all cookies (including essential cookies) you may not be able to access all or parts of our website.
                </p>
                <p className="text-white/70 text-sm">
                  Except for essential cookies, all cookies will expire after 90 days.
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </div>
  )
}