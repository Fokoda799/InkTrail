import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Mail, ExternalLink } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10"
      >
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link 
              to="/"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-amber-600 transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Home
            </Link>
            <div className="flex items-center gap-3 ml-auto">
              <Shield className="w-6 h-6 text-amber-500" />
              <span className="font-semibold text-gray-900">InkTrail Privacy</span>
            </div>
          </div>
        </div>
      </motion.div>

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
              <Shield className="w-16 h-16 mx-auto mb-4 opacity-90" />
              <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
              <p className="text-amber-100 text-lg">Last updated: August 23, 2025</p>
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
                This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your information when You use the Service and tells You about Your privacy rights and how the law protects You.
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">
                We use Your Personal data to provide and improve the Service. By using the Service, You agree to the collection and use of information in accordance with this Privacy Policy. This Privacy Policy has been created with the help of the{' '}
                <a 
                  href="https://www.termsfeed.com/privacy-policy-generator/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-amber-600 hover:text-amber-700 inline-flex items-center gap-1 transition-colors duration-150"
                >
                  Privacy Policy Generator
                  <ExternalLink className="w-4 h-4" />
                </a>.
              </p>
            </div>

            {/* Interpretation and Definitions */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-amber-200">
                Interpretation and Definitions
              </h2>
              
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Interpretation</h3>
                <p className="text-gray-600 leading-relaxed">
                  The words of which the initial letter is capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Definitions</h3>
                <p className="text-gray-600 mb-6">For the purposes of this Privacy Policy:</p>
                
                <div className="space-y-4">
                  {[
                    { term: "Account", definition: "means a unique account created for You to access our Service or parts of our Service." },
                    { term: "Affiliate", definition: 'means an entity that controls, is controlled by or is under common control with a party, where "control" means ownership of 50% or more of the shares, equity interest or other securities entitled to vote for election of directors or other managing authority.' },
                    { term: "Company", definition: '(referred to as either "the Company", "We", "Us" or "Our" in this Agreement) refers to InkTrail.' },
                    { term: "Cookies", definition: "are small files that are placed on Your computer, mobile device or any other device by a website, containing the details of Your browsing history on that website among its many uses." },
                    { term: "Country", definition: "refers to: Morocco" },
                    { term: "Device", definition: "means any device that can access the Service such as a computer, a cellphone or a digital tablet." },
                    { term: "Personal Data", definition: "is any information that relates to an identified or identifiable individual." },
                    { term: "Service", definition: "refers to the Website." },
                    { term: "Service Provider", definition: "means any natural or legal person who processes the data on behalf of the Company. It refers to third-party companies or individuals employed by the Company to facilitate the Service, to provide the Service on behalf of the Company, to perform services related to the Service or to assist the Company in analyzing how the Service is used." },
                    { term: "Third-party Social Media Service", definition: "refers to any website or any social network website through which a User can log in or create an account to use the Service." },
                    { term: "Usage Data", definition: "refers to data collected automatically, either generated by the use of the Service or from the Service infrastructure itself (for example, the duration of a page visit)." },
                    { term: "Website", definition: "refers to InkTrail, accessible from https://ink-trail-rouge.vercel.app/" },
                    { term: "You", definition: "means the individual accessing or using the Service, or the company, or other legal entity on behalf of which such individual is accessing or using the Service, as applicable." }
                  ].map((item, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4 border-l-4 border-amber-400">
                      <p className="text-gray-700">
                        <strong className="text-gray-900">{item.term}</strong> {item.definition}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Data Collection */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-amber-200">
                Collecting and Using Your Personal Data
              </h2>

              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Types of Data Collected</h3>
                
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Personal Data</h4>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    While using Our Service, We may ask You to provide Us with certain personally identifiable information that can be used to contact or identify You. Personally identifiable information may include, but is not limited to:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                    <li>Email address</li>
                    <li>First name and last name</li>
                    <li>Usage Data</li>
                  </ul>
                </div>

                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Usage Data</h4>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    Usage Data is collected automatically when using the Service.
                  </p>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    Usage Data may include information such as Your Device's Internet Protocol address (e.g. IP address), browser type, browser version, the pages of our Service that You visit, the time and date of Your visit, the time spent on those pages, unique device identifiers and other diagnostic data.
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    When You access the Service by or through a mobile device, We may collect certain information automatically, including, but not limited to, the type of mobile device You use, Your mobile device unique ID, the IP address of Your mobile device, Your mobile operating system, the type of mobile Internet browser You use, unique device identifiers and other diagnostic data.
                  </p>
                </div>

                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Information from Third-Party Social Media Services</h4>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    The Company allows You to create an account and log in to use the Service through the following Third-party Social Media Services:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4 mb-4">
                    <li>Google</li>
                    <li>Facebook</li>
                    <li>Instagram</li>
                    <li>Twitter</li>
                    <li>LinkedIn</li>
                  </ul>
                  <p className="text-gray-600 leading-relaxed">
                    If You decide to register through or otherwise grant us access to a Third-Party Social Media Service, We may collect Personal data that is already associated with Your Third-Party Social Media Service's account, such as Your name, Your email address, Your activities or Your contact list associated with that account.
                  </p>
                </div>
              </div>
            </section>

            {/* Data Usage */}
            <section className="mb-12">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Use of Your Personal Data</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                The Company may use Personal Data for the following purposes:
              </p>
              
              <div className="space-y-4">
                {[
                  "To provide and maintain our Service, including to monitor the usage of our Service.",
                  "To manage Your Account: to manage Your registration as a user of the Service.",
                  "For the performance of a contract: the development, compliance and undertaking of the purchase contract for the products, items or services You have purchased.",
                  "To contact You: To contact You by email, telephone calls, SMS, or other equivalent forms of electronic communication.",
                  "To provide You with news, special offers and general information about other goods, services and events.",
                  "To manage Your requests: To attend and manage Your requests to Us.",
                  "For business transfers: We may use Your information to evaluate or conduct a merger, divestiture, restructuring, reorganization, dissolution, or other sale.",
                  "For other purposes: We may use Your information for other purposes, such as data analysis, identifying usage trends, determining the effectiveness of our promotional campaigns."
                ].map((purpose, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-amber-400 mt-3 flex-shrink-0"></div>
                    <p className="text-gray-600 leading-relaxed">{purpose}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Data Sharing */}
            <section className="mb-12">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Sharing Your Personal Information</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                We may share Your personal information in the following situations:
              </p>
              
              <div className="space-y-4">
                {[
                  { title: "With Service Providers:", description: "We may share Your personal information with Service Providers to monitor and analyze the use of our Service, to contact You." },
                  { title: "For business transfers:", description: "We may share or transfer Your personal information in connection with, or during negotiations of, any merger, sale of Company assets, financing, or acquisition." },
                  { title: "With Affiliates:", description: "We may share Your information with Our affiliates, in which case we will require those affiliates to honor this Privacy Policy." },
                  { title: "With business partners:", description: "We may share Your information with Our business partners to offer You certain products, services or promotions." },
                  { title: "With other users:", description: "when You share personal information or otherwise interact in the public areas with other users, such information may be viewed by all users." },
                  { title: "With Your consent:", description: "We may disclose Your personal information for any other purpose with Your consent." }
                ].map((item, index) => (
                  <div key={index} className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                    <p className="text-gray-700">
                      <strong className="text-gray-900">{item.title}</strong> {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Data Security & Rights */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-amber-200">
                Your Rights and Data Security
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Delete Your Personal Data</h3>
                  <p className="text-gray-600 leading-relaxed">
                    You have the right to delete or request that We assist in deleting the Personal Data that We have collected about You. Our Service may give You the ability to delete certain information about You from within the Service.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Security of Your Personal Data</h3>
                  <p className="text-gray-600 leading-relaxed">
                    The security of Your Personal Data is important to Us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure.
                  </p>
                </div>
              </div>
            </section>

            {/* Children's Privacy */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-amber-200">
                Children's Privacy
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Our Service does not address anyone under the age of 13. We do not knowingly collect personally identifiable information from anyone under the age of 13. If You are a parent or guardian and You are aware that Your child has provided Us with Personal Data, please contact Us.
              </p>
            </section>

            {/* Changes to Policy */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-amber-200">
                Changes to this Privacy Policy
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                We may update Our Privacy Policy from time to time. We will notify You of any changes by posting the new Privacy Policy on this page.
              </p>
              <p className="text-gray-600 leading-relaxed">
                We will let You know via email and/or a prominent notice on Our Service, prior to the change becoming effective and update the "Last updated" date at the top of this Privacy Policy.
              </p>
            </section>

            {/* Contact */}
            <section className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-8 border border-amber-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Mail className="w-6 h-6 text-amber-500" />
                Contact Us
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                If you have any questions about this Privacy Policy, You can contact us:
              </p>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-amber-500" />
                <a 
                  href="mailto:abdllahhadid@gmail.com"
                  className="text-amber-600 hover:text-amber-700 font-medium transition-colors duration-150"
                >
                  abdllahhadid@gmail.com
                </a>
              </div>
            </section>
          </motion.div>
        </motion.div>

        {/* Footer Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-12 text-center"
        >
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <Link to="/terms" className="text-gray-600 hover:text-amber-600 transition-colors duration-150">
              Terms of Service
            </Link>
            <Link to="/cookies" className="text-gray-600 hover:text-amber-600 transition-colors duration-150">
              Cookie Policy
            </Link>
            <Link to="/support" className="text-gray-600 hover:text-amber-600 transition-colors duration-150">
              Support
            </Link>
            <Link to="/" className="text-amber-600 hover:text-amber-700 font-medium transition-colors duration-150">
              Back to InkTrail
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;