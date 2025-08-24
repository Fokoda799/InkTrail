import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, X, Send, User, MessageCircle } from 'lucide-react';
import { useAlert } from 'react-alert';

const VITE_API_BASE = import.meta.env.VITE_API_BASE;
interface ContactModalProps {
  setIsOpen: (open: boolean) => void;
}

const ContactModal: React.FC<ContactModalProps> = ({ setIsOpen }) => {
  const alert = useAlert();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch(`${VITE_API_BASE}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert.success('Message sent successfully!');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert.error('Failed to send message.');
    } finally {
      setLoading(false);
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Modal Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={() => setIsOpen(false)}
      >
        {/* Modal Card */}
        <motion.div
          id='contact'
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ 
            type: "spring",
            damping: 25,
            stiffness: 300,
            duration: 0.3
          }}
          className="bg-white rounded-3xl shadow-2xl border border-gray-100/50 max-w-xl w-full relative max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Scrollable Content */}
          <div className="overflow-y-auto max-h-[90vh] scrollbar-hide" style={{
            scrollbarWidth: 'none', // Firefox
            msOverflowStyle: 'none', // IE and Edge
          }}>
            <style>{`
              .scrollbar-hide::-webkit-scrollbar {
                display: none; /* Chrome, Safari, Opera */
              }
            `}</style>
            
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-6 right-6 z-10 text-white/90 hover:text-white hover:bg-white/20 transition-all duration-200 p-2 rounded-full backdrop-blur-sm"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header with Gradient */}
            <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 px-8 py-10 text-white text-center relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 bg-white/10 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_70%)]"></div>
              
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="relative"
              >
                <div className="bg-white/20 backdrop-blur-sm rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <Mail className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold mb-2">Get In Touch</h2>
                <p className="text-white/90 text-lg">We'd love to hear from you!</p>
              </motion.div>
            </div>

            {/* Form Content */}
            <div className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Input */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <label className=" text-gray-700 font-semibold mb-2 flex items-center gap-2">
                    <User className="w-4 h-4 text-amber-500" />
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Your full name"
                    className="w-full border-2 focus:text-gray-600 text-gray-600 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all duration-200 bg-gray-50 hover:bg-white"
                    required
                  />
                </motion.div>

                {/* Email Input */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <label className=" text-gray-700 font-semibold mb-2 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-amber-500" />
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your@email.com"
                    className="w-full border-2 focus:text-gray-600 text-gray-600 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all duration-200 bg-gray-50 hover:bg-white"
                    required
                  />
                </motion.div>

                {/* Message Textarea */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <label className=" text-gray-700 font-semibold mb-2 flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-amber-500" />
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Tell us what's on your mind..."
                    className="w-full border-2 focus:text-gray-600 text-gray-600 border-gray-200 rounded-xl px-4 py-3 h-32 resize-none focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all duration-200 bg-gray-50 hover:bg-white"
                    required
                  />
                </motion.div>

                {/* Submit Button */}
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  disabled={loading}
                  type="submit"
                  className={`w-full py-4 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 group
                    ${loading ? 'opacity-40 cursor-not-allowed bg-gray-500' : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600'}`}
                >
                  <Send className={`w-5 h-5 group-hover:translate-x-1 transition-transform duration-200 ${loading ? 'animate-spin' : ''}`} />
                  {loading ? 'Sending...' : 'Send Message'}
                </motion.button>
              </form>

              {/* Contact Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="mt-8 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl"
              >
                <div className="flex items-center justify-center gap-3 text-gray-700">
                  <div className="bg-amber-100 p-2 rounded-full">
                    <Mail className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Or reach us directly at:</p>
                    <a
                      href="mailto:abdllah.hadid@gmail.com"
                      className="text-amber-600 hover:text-amber-700 font-semibold transition-colors duration-150 hover:underline"
                    >
                      abdllah.hadid@gmail.com
                    </a>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
};

export default ContactModal;