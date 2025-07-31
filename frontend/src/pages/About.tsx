import React from 'react';
import { motion } from 'framer-motion';
import { Users, Target, Eye, ArrowRight, ExternalLink, Award, Heart, Zap } from 'lucide-react';

const About = () => {
  const handleRedirect = () => {
    window.open('https://www.linkedin.com/in/fokoda-code/', '_blank');
  };

  const teamMembers = [
    { 
      name: 'Abdellah Nait Hadid', 
      role: 'CEO & Founder', 
      avatar: 'https://via.placeholder.com/150',
      bio: 'Passionate about creating platforms that empower writers and storytellers worldwide.',
      linkedin: 'https://www.linkedin.com/in/fokoda-code/'
    },
  ];

  const values = [
    {
      icon: <Heart className="w-8 h-8" />,
      title: 'Community First',
      description: 'We believe in building a supportive community where every voice matters and every story has value.'
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Innovation',
      description: 'Constantly pushing boundaries with cutting-edge technology to enhance the writing experience.'
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: 'Excellence',
      description: 'Committed to delivering exceptional quality in everything we do, from features to user support.'
    }
  ];

  const stats = [
    { number: '10K+', label: 'Active Writers' },
    { number: '50K+', label: 'Stories Published' },
    { number: '100K+', label: 'Monthly Readers' },
    { number: '4.9★', label: 'User Rating' }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-br from-amber-400/10 to-orange-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-orange-400/10 to-red-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-sm font-medium mb-8">
              <Users className="w-4 h-4" />
              Building the future of storytelling
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              About{' '}
              <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                InkTrail
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Welcome to our platform! We are committed to delivering exceptional services and fostering an engaging community. 
              Our goal is to revolutionize the way you experience storytelling and writing.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-gradient-to-r from-gray-50 to-amber-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full text-white">
                  <Target className="w-6 h-6" />
                </div>
                <h2 className="text-4xl font-bold text-gray-900">Our Mission</h2>
              </div>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                To provide the best solutions that empower individuals and businesses alike. We believe in making a difference 
                through cutting-edge technology and a customer-centric approach.
              </p>
              <p className="text-gray-600 leading-relaxed">
                With a dedicated team and innovative solutions, we are constantly striving to push boundaries and create 
                meaningful connections through the power of storytelling.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="bg-white rounded-2xl p-8 shadow-xl">
                <div className="aspect-square bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg mb-6 flex items-center justify-center">
                  <Target className="w-16 h-16 text-amber-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Empowering Writers</h3>
                <p className="text-gray-600">
                  We provide tools and community support to help writers at every level share their stories and connect with readers worldwide.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full text-white">
                <Eye className="w-6 h-6" />
              </div>
              <h2 className="text-4xl font-bold text-gray-900">Our Vision</h2>
            </div>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              To be a global leader in digital storytelling platforms, recognized for our commitment to innovation, 
              excellence, and fostering authentic human connections through the written word.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Values</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do and shape our community.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group"
              >
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 h-full border border-gray-100 hover:border-amber-200 group-hover:-translate-y-2">
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-6 p-4 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full text-white group-hover:scale-110 transition-transform duration-300">
                      {value.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{value.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{value.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Meet Our Team</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The passionate individuals behind InkTrail who are dedicated to empowering writers worldwide.
            </p>
          </motion.div>
          
          <div className="flex justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group"
                >
                  <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-amber-200 group-hover:-translate-y-2">
                    <div className="flex flex-col items-center text-center">
                      <div className="relative mb-6">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-2xl font-bold overflow-hidden">
                          {member.avatar ? (
                            <img 
                              src={member.avatar} 
                              alt={member.name} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            member.name.split(' ').map(n => n[0]).join('')
                          )}
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                      <p className="text-amber-600 font-medium mb-4">{member.role}</p>
                      
                      {member.bio && (
                        <p className="text-gray-600 text-sm leading-relaxed mb-6">{member.bio}</p>
                      )}
                      
                      <button
                        onClick={handleRedirect}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full hover:from-amber-600 hover:to-orange-600 transition-all duration-200 font-medium group-hover:scale-105"
                      >
                        Connect
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
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
              Ready to Join Our Community?
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Become part of InkTrail and start sharing your stories with writers and readers from around the world.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = '/signup'}
              className="inline-flex items-center gap-3 bg-white text-amber-600 px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Get Started Today
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;