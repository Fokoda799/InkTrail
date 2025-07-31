import React from 'react';
import { motion } from 'framer-motion';
import { Edit3, Compass, Users, ArrowRight, Star, CheckCircle } from 'lucide-react';

interface FeatureCardProps {
  icon: React.ReactElement;
  title: string;
  description: string;
  delay?: number;
}

const LandingPage = () => {
  const handleGetStarted = () => {
    // Placeholder for navigation - could integrate with router later
    console.log('Navigate to signup');
  };

  const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, delay = 0 }) => (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className="group"
    >
      <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 h-full border border-gray-100 hover:border-amber-200 group-hover:-translate-y-2">
        <div className="flex flex-col items-center text-center">
          <div className="mb-6 p-4 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full text-white group-hover:scale-110 transition-transform duration-300">
            {icon}
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">{title}</h3>
          <p className="text-gray-600 leading-relaxed">{description}</p>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
          <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1591447/pexels-photo-1591447.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop')] bg-cover bg-center opacity-10"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-amber-900/20 via-orange-900/10 to-red-900/20"></div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-br from-amber-400/10 to-orange-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-orange-400/10 to-red-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-sm font-medium mb-8"
            >
              <Star className="w-4 h-4" />
              Join thousands of writers already sharing their stories
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                InkTrail
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Share your thoughts, discover new ideas, and create your own writing trail in a community that celebrates storytelling.
            </p>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGetStarted}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Get Started Today
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Why Choose InkTrail?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the perfect blend of creativity and community in our carefully crafted writing platform.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Edit3 className="w-8 h-8" />}
              title="Express Yourself"
              description="Write and share your thoughts, stories, and ideas with our intuitive and powerful writing tools designed for creators."
              delay={0.1}
            />
            <FeatureCard
              icon={<Compass className="w-8 h-8" />}
              title="Discover Content"
              description="Explore a vast library of topics and find inspiration from talented writers across diverse genres and styles."
              delay={0.2}
            />
            <FeatureCard
              icon={<Users className="w-8 h-8" />}
              title="Connect with Others"
              description="Build meaningful relationships with like-minded individuals and engage in thoughtful discussions about your craft."
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { number: '10K+', label: 'Active Writers' },
              { number: '50K+', label: 'Stories Shared' },
              { number: '100K+', label: 'Monthly Readers' },
              { number: '4.9★', label: 'User Rating' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-r from-amber-50 to-orange-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Everything you need to succeed as a writer
              </h2>
              <div className="space-y-4">
                {[
                  'Advanced text editor with real-time collaboration',
                  'Analytics to track your content performance',
                  'SEO optimization tools for maximum reach',
                  'Community feedback and peer reviews',
                  'Monetization options for your content'
                ].map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="bg-white rounded-2xl p-8 shadow-xl">
                <div className="aspect-video bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg mb-6 flex items-center justify-center">
                  <Edit3 className="w-16 h-16 text-amber-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Rich Writing Experience</h3>
                <p className="text-gray-600">
                  Our platform provides all the tools you need to craft compelling content, from basic text formatting to advanced publishing features.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-r from-amber-500 to-orange-500 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Start Your Writing Journey?
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Join InkTrail today and become part of our thriving community of writers and readers who are passionate about storytelling.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGetStarted}
              className="inline-flex items-center gap-3 bg-white text-amber-600 px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Sign Up Now - It's Free
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;