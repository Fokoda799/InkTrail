import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Mail, ExternalLink, Calendar, Shield } from 'lucide-react';
import ContactModal from '../components/ContacModal';

const TermsOfService: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
        >
          {/* Header Section */}
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-12 text-white">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-center"
            >
              <FileText className="w-16 h-16 mx-auto mb-4 opacity-90" />
              <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
              <div className="flex items-center justify-center gap-6 text-amber-100">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>Effective: August 23, 2025</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>Updated: August 23, 2025</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="px-8 py-12"
          >
            {/* Introduction */}
            <div className="prose prose-gray max-w-none mb-12">
              <p className="text-lg leading-relaxed text-gray-700 mb-6">
                Welcome to InkTrail (the "Website"), located at{' '}
                <a 
                  href="https://ink-trail-rouge.vercel.app/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-amber-600 hover:text-amber-700 inline-flex items-center gap-1 transition-colors duration-150"
                >
                  https://ink-trail-rouge.vercel.app/
                  <ExternalLink className="w-4 h-4" />
                </a>
                . By accessing or using our Website, you agree to be bound by these Terms of Service ("Terms"). Please read them carefully. If you do not agree, you must not use InkTrail.
              </p>
            </div>

            {/* Terms Sections */}
            <div className="space-y-12">
              {/* Section 1: Overview */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-amber-200 flex items-center gap-3">
                  <span className="bg-amber-100 text-amber-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">1</span>
                  Overview
                </h2>
                <div className="bg-amber-50 rounded-lg p-6 border border-amber-200">
                  <p className="text-gray-700 leading-relaxed">
                    InkTrail is a blog platform where users can create and publish articles with images, as well as explore and comment on articles shared by other authors.
                  </p>
                </div>
              </section>

              {/* Section 2: Eligibility & Accounts */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-amber-200 flex items-center gap-3">
                  <span className="bg-amber-100 text-amber-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">2</span>
                  Eligibility & Accounts
                </h2>
                <div className="space-y-4">
                  {[
                    "To use InkTrail, you must be at least 13 years old.",
                    "You must register with your full name and valid email address.",
                    "You are responsible for maintaining the confidentiality of your account and password.",
                    "You agree to notify us immediately of any unauthorized use of your account."
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="w-2 h-2 rounded-full bg-amber-400 mt-3 flex-shrink-0"></div>
                      <p className="text-gray-700 leading-relaxed">{item}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Section 3: User Content */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-amber-200 flex items-center gap-3">
                  <span className="bg-amber-100 text-amber-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">3</span>
                  User Content
                </h2>
                <div className="space-y-4">
                  <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
                    <p className="text-gray-700 leading-relaxed mb-4">
                      By posting articles, images, or comments ("User Content") on InkTrail, you grant us a non-exclusive, worldwide, royalty-free license to display and distribute your content solely on the platform.
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-orange-200">
                        <Shield className="w-5 h-5 text-green-500" />
                        <span className="text-gray-700 font-medium">You retain full ownership of your content</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-orange-200">
                        <Shield className="w-5 h-5 text-amber-500" />
                        <span className="text-gray-700 font-medium">You're responsible for legal compliance</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    You are responsible for ensuring your content does not violate any laws, copyrights, or third-party rights.
                  </p>
                </div>
              </section>

              {/* Section 4: Acceptable Use */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-amber-200 flex items-center gap-3">
                  <span className="bg-amber-100 text-amber-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">4</span>
                  Acceptable Use
                </h2>
                <div className="bg-red-50 rounded-lg p-6 border border-red-200">
                  <p className="text-gray-700 font-medium mb-4">You agree not to:</p>
                  <div className="space-y-3">
                    {[
                      "Post content that is illegal, offensive, defamatory, or harmful.",
                      "Upload viruses, malware, or engage in activity that disrupts the Website.",
                      "Use InkTrail for spam, impersonation, or unauthorized advertising."
                    ].map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-red-400 mt-3 flex-shrink-0"></div>
                        <p className="text-gray-700 leading-relaxed">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Section 5: Termination */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-amber-200 flex items-center gap-3">
                  <span className="bg-amber-100 text-amber-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">5</span>
                  Termination
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-200">
                    <h3 className="font-semibold text-gray-800 mb-3">We may suspend your account if you:</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 rounded-full bg-yellow-400 mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700">Violate these Terms, or</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 rounded-full bg-yellow-400 mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700">Engage in harmful or abusive behavior on the platform.</span>
                      </li>
                    </ul>
                  </div>
                  <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                    <h3 className="font-semibold text-gray-800 mb-3">Your Rights:</h3>
                    <p className="text-gray-700">You may also request account deletion at any time.</p>
                  </div>
                </div>
              </section>

              {/* Section 6: Intellectual Property */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-amber-200 flex items-center gap-3">
                  <span className="bg-amber-100 text-amber-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">6</span>
                  Intellectual Property
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                    <h3 className="font-semibold text-gray-800 mb-3">InkTrail Owns:</h3>
                    <p className="text-gray-700">All website design, branding, and functionality belong to InkTrail.</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
                    <h3 className="font-semibold text-gray-800 mb-3">You Own:</h3>
                    <p className="text-gray-700">User-generated content remains the property of its respective authors.</p>
                  </div>
                </div>
              </section>

              {/* Section 7: No Payments */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-amber-200 flex items-center gap-3">
                  <span className="bg-amber-100 text-amber-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">7</span>
                  No Payments
                </h2>
                <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                  <p className="text-gray-700 leading-relaxed">
                    Currently, InkTrail is free to use. If payments or premium services are introduced in the future, these Terms will be updated accordingly.
                  </p>
                </div>
              </section>

              {/* Section 8: Limitation of Liability */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-amber-200 flex items-center gap-3">
                  <span className="bg-amber-100 text-amber-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">8</span>
                  Limitation of Liability
                </h2>
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <p className="text-gray-700 leading-relaxed">
                    InkTrail is provided "as is" without warranties of any kind. We do not guarantee that the Website will always be secure, error-free, or available. InkTrail is not responsible for any damages arising from your use of the platform.
                  </p>
                </div>
              </section>

              {/* Section 9: Changes to Terms */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-amber-200 flex items-center gap-3">
                  <span className="bg-amber-100 text-amber-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">9</span>
                  Changes to Terms
                </h2>
                <div className="bg-amber-50 rounded-lg p-6 border border-amber-200">
                  <p className="text-gray-700 leading-relaxed">
                    We may update these Terms from time to time. The updated version will always be posted on this page with the "Last Updated" date.
                  </p>
                </div>
              </section>

              {/* Section 10: Contact */}
              <section className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-8 border border-amber-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <span className="bg-amber-100 text-amber-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">10</span>
                  <Mail className="w-6 h-6 text-amber-500" />
                  Contact Us
                </h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  If you have any questions about these Terms, please contact us at:
                </p>
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => setIsOpen(true)}>
                  <Mail className="w-5 h-5 text-amber-500" />
                  <span className="text-amber-600 hover:text-amber-400">abdllahhadid@gmail.com</span>
                </div>
              </section>
            </div>
          </motion.div>
        </motion.div>
        {isOpen && <ContactModal setIsOpen={setIsOpen} />}
      </div>
    </div>
  );
};

export default TermsOfService;